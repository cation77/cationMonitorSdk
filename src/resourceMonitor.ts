import { sendErrorData } from "./sender";

export const monitorResourceErrors = (
  reportUrl: string,
  projectName: string,
  environment: string
) => {
  // 捕获资源加载错误
  window.addEventListener(
    "error",
    (event) => {
      const target = event.target as HTMLElement;
      // 过滤掉非图片、脚本和链接元素
      if (target && (target.tagName === "IMG" || target.tagName === "SCRIPT" || target.tagName === "LINK")) {
        const url = target.getAttribute("src") || target.getAttribute("href");
        sendErrorData(
          {
            type: "Resource Load Error",
            message: `Failed to load ${target.tagName} ${url}`,
            url,
            projectName,
            environment,
            timestamp: new Date().toISOString(),
          },
          reportUrl
        );
      }
    },
    true
  ); // 捕获阶段
};
