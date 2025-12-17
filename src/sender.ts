import { getBrowserInfo } from './utils';
import { MonitorData } from './types';
import worker from './worker';
import request from './request';
export const sendMonitorData = (data: MonitorData, url: string) => {
  const reportData = {
    ...data,
    // 获取浏览器信息并合并到错误数据中
    browserInfo: getBrowserInfo()
  };
  if (!worker) {
    request(reportData, url);
  } else {
    worker?.postMessage({ type: 'report', reportData });
  }
};
