# Monitor SDK

一个轻量级的前端监控 SDK，可以捕获 JavaScript 错误、Promise 异常、网络请求错误以及资源加载错误。

## 功能特性

### 错误监控

- **JavaScript 错误监控**: 捕获未捕获的 JavaScript 错误 (`window.onerror`)。
- **Promise 异常监控**: 捕获未处理的 Promise 拒绝 (`window.onunhandledrejection`)。
- **网络错误监控**:
  - 拦截并监控 `XMLHttpRequest` 错误。
  - 拦截并监控 `fetch` API 错误。
- **资源加载错误监控**: 捕获资源（如图片 `<img>`、样式表 `<link>` 和脚本 `<script>`）加载失败的错误。

### 数据上报

优先使用 `navigator.sendBeacon` 进行可靠的数据上报，如果不支持则降级使用 `fetch`。

## 安装

```bash
npm install cation-monitor-sdk
```

## 使用方法

在你的应用入口文件（例如 `main.js` 或 `App.tsx`）中初始化 SDK。

```javascript
import { initMonitor } from 'cation-monitor-sdk';

initMonitor({
  reportUrl: 'https://your-monitoring-server.com/api/report', // 你的错误上报接口地址
  projectName: 'my-awesome-project', // 项目名称
  environment: 'production' // 当前环境，如 'development', 'staging', 'production' 等
});
```

## 配置项

`initMonitor` 函数接受一个配置对象，包含以下属性：

|    属性名     |   类型   |                             说明                             |
| :-----------: | :------: | :----------------------------------------------------------: |
|  `reportUrl`  | `string` |    **必填**。错误数据将通过 POST 请求发送到的 URL 地址。     |
| `projectName` | `string` |            **必填**。用于标识错误来源的项目名称。            |
| `environment` | `string` | **必填**。当前运行环境（例如 'production', 'development'）。 |
