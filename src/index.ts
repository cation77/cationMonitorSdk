import { monitorJavaScriptErrors } from "./errorHandler";
import { monitorResourceErrors } from "./resourceMonitor";
import { monitorNetworkErrors } from "./networkMonitor";
import { sendErrorData } from "./sender";

interface ErrorMonitorConfig {
  reportUrl: string;
  projectName: string;
  environment: string;
}

export const initErrorMonitor = (config: ErrorMonitorConfig) => {
  const { reportUrl, projectName, environment } = config;

  monitorJavaScriptErrors(reportUrl, projectName, environment);
  monitorResourceErrors(reportUrl, projectName, environment);
  monitorNetworkErrors(reportUrl, projectName, environment);
};

// Vue 3 插件：统一接入框架错误 + 自动初始化全局监控
export const VueErrorMonitorPlugin = {
  install(app: any, options: ErrorMonitorConfig) {
    if (!options.reportUrl || !options.projectName || !options.environment) {
      console.error(
        "ErrorMonitorPlugin: reportUrl, projectName, environment are required"
      );
      return;
    }
    // 初始化错误监控
    initErrorMonitor(options);
    const original = app.config.errorHandler;
    app.config.errorHandler = (
      err: unknown,
      instance?: unknown,
      info?: unknown
    ) => {
      sendErrorData(
        {
          type: "Vue Error",
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : null,
          instance,
          info,
          projectName: options.projectName,
          environment: options.environment,
          timestamp: new Date().toISOString(),
        },
        options.reportUrl
      );

      if (typeof original === "function") {
        try {
          original(err, instance, info);
        } catch {}
      }
    };
  },
};

// React 错误边界：捕获子树渲染错误并上报
export const createReactErrorBoundary = (
  React: any,
  config: ErrorMonitorConfig
) => {
  // 确保在创建边界组件时启动全局监控
  if (config.reportUrl) {
    initErrorMonitor(config);
  }

  return class ErrorMonitorBoundary extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: Error, info: any) {
      sendErrorData(
        {
          type: "React Error",
          message: error.message,
          stack: error?.stack || null,
          componentStack: info?.componentStack || null,
          projectName: config.projectName,
          environment: config.environment,
          timestamp: new Date().toISOString(),
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
