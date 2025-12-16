import { getBrowserInfo } from './utils';
import { MonitorData } from './types';
export const sendMonitorData = (errorData: MonitorData, url: string) => {
  const dataToSend = {
    ...errorData,
    // 获取浏览器信息并合并到错误数据中
    browserInfo: getBrowserInfo()
  };
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(dataToSend)], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    }).catch(console.error);
  }
};
