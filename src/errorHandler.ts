import { sendErrorData } from "./sender";

export const monitorJavaScriptErrors = (
  reportUrl: string,
  projectName: string,
  environment: string
) => {
  // 捕获 JavaScript 运行时错误
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    const errorInfo = {
      type: "JavaScript Error",
      message,
      source,
      lineno,
      colno,
      stack: error ? error.stack : null,
      projectName,
      environment,
      timestamp: new Date().toISOString(),
    };
    sendErrorData(errorInfo, reportUrl);

    // 调用原始的 onerror 处理函数
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
  };

  // 捕获 Promise 错误
  const originalOnUnhandledRejection = window.onunhandledrejection;
  window.addEventListener("unhandledrejection", (event) => {
    const errorInfo = {
      type: "unhandled Promise Rejection",
      message:
        event.reason?.message || event.reason || "Unhandled Promise Rejection",
      stack: event.reason?.stack || null,
      projectName,
      environment,
      timestamp: new Date().toISOString(),
    };
    sendErrorData(errorInfo, reportUrl);
    if (originalOnUnhandledRejection) {
      return originalOnUnhandledRejection.call(window, event);
    }
  });
};
