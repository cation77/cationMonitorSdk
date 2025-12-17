import { monitorJavaScriptErrors } from './errorHandler';
import { monitorResourceErrors } from './resourceMonitor';
import { monitorNetworkErrors } from './networkMonitor';
import { formatErrorMessage } from './utils';
import { sendMonitorData } from './sender';
import worker from './worker';

interface ErrorMonitorConfig {
  reportUrl: string;
  projectName: string;
  environment: string;
}

let $monitorInitialized = false;

export const initMonitor = (config: ErrorMonitorConfig) => {
  const { reportUrl, projectName, environment } = config;
  worker?.postMessage({ type: 'init', reportUrl });
  monitorJavaScriptErrors(reportUrl, projectName, environment);
  monitorResourceErrors(reportUrl, projectName, environment);
  monitorNetworkErrors(reportUrl, projectName, environment);
};

// Vue 3 插件：统一接入框架错误 + 自动初始化全局监控
export const VueMonitorPlugin = {
  install(app: any, options: ErrorMonitorConfig) {
    if (!options.reportUrl || !options.projectName || !options.environment) {
      console.error('MonitorPlugin: reportUrl, projectName, environment are required');
      return;
    }
    // 初始化错误监控
    if (!$monitorInitialized) {
      initMonitor(options);
      $monitorInitialized = true;
    }
    const original = app.config.errorHandler;
    app.config.errorHandler = (err: unknown, instance?: unknown, info?: unknown) => {
      sendMonitorData(
        {
          type: 'Vue Error',
          message: formatErrorMessage(err),
          stack: err instanceof Error ? err.stack : null,
          instance,
          info,
          projectName: options.projectName,
          environment: options.environment,
          timestamp: Date.now()
        },
        options.reportUrl
      );

      if (typeof original === 'function') {
        try {
          original(err, instance, info);
        } catch {}
      }
    };
  }
};

// React 错误边界：捕获子树渲染错误并上报
export const createReactMonitorBoundary = (React: any, config: ErrorMonitorConfig) => {
  // 确保在创建边界组件时启动全局监控
  if (config.reportUrl && !$monitorInitialized) {
    initMonitor(config);
    $monitorInitialized = true;
  }

  return class MonitorBoundary extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: Error, info: any) {
      sendMonitorData(
        {
          type: 'React Error',
          message: formatErrorMessage(error),
          stack: error?.stack || null,
          componentStack: info?.componentStack || null,
          projectName: config.projectName,
          environment: config.environment,
          timestamp: Date.now()
        },
        config.reportUrl
      );
    }

    render() {
      if (this.state.hasError) {
        return this.props.fallback || null;
      }
      return this.props.children;
    }
  };
};
