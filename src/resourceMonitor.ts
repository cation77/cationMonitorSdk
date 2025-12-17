import { sendMonitorData } from './sender';

export const monitorResourceErrors = (reportUrl: string, projectName: string, environment: string) => {
  // 捕获资源加载错误
  // 注意：资源加载错误不会冒泡，所以必须在捕获阶段处理 (useCapture = true)
  window.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLElement;
      // 过滤掉非图片、脚本和样式链接元素
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        const url = target.getAttribute('src') || target.getAttribute('href');
        sendMonitorData(
          {
            type: 'Resource Load Error',
            message: `Failed to load ${target.tagName} ${url}`,
            url,
            tagName: target.tagName,
            outerHTML: target.outerHTML,
            projectName,
            environment,
            timestamp: Date.now()
          },
          reportUrl
        );
      }
    },
    true //  // useCapture 为 true 确保资源错误被捕获
  );
};
