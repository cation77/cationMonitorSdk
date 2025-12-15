import { sendErrorData } from "./sender";

export const monitorNetworkErrors = (
  reportUrl: string,
  projectName: string,
  environment: string
) => {
  // 捕获网络请求错误
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    ...args: any[]
  ) {
    const urlStr = typeof url === "string" ? url : url.toString();
    if (urlStr.indexOf(reportUrl) !== -1) {
      // 过滤掉上报接口的请求
      return originalXhrOpen.call(this, method, url, ...args);
    }

    // 监听 error 事件
    this.addEventListener("error", () => {
      sendErrorData(
        {
          type: "Network Error",
          message: `Request failed: ${method} ${url}`,
          url: urlStr,
          projectName,
          environment,
          timestamp: new Date().toISOString(),
        },
        reportUrl
      );
    });

    return originalXhrOpen.call(this, method, url, ...args);
  };

  // 捕获 fetch 请求错误
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const urlStr = input instanceof Request ? input.url : input.toString();
    if (urlStr.indexOf(reportUrl) !== -1) {
      // 过滤掉上报接口的请求
      return originalFetch(input, init);
    }
    try {
      const response = await originalFetch(input, init);
      if (!response.ok) {
        sendErrorData(
          {
            type: "Fetch Error",
            message: `HTTP ${response.status} ${response.statusText}`,
            url: urlStr,
            projectName,
            environment,
            timestamp: new Date().toISOString(),
          },
          reportUrl
        );
      }
      return response;
    } catch (error) {
      // 网络故障等无法发出请求的情况
      sendErrorData(
        {
          type: "Fetch Error",
          message: `Fetch failed: ${input}`,
          url: urlStr,
          projectName,
          environment,
          timestamp: new Date().toISOString(),
        },
        reportUrl
      );
      throw error;
    }
  };
};
