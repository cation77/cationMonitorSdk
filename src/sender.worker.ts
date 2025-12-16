import type { WorkerCommand } from './types';

let $timer = null;
let reportUrl = '';

const loop = () => {
  console.log('worker loop', reportUrl);
  $timer = setTimeout(() => {
    loop();
  }, 10000);
};

self.onmessage = (e: MessageEvent<WorkerCommand>) => {
  const { type } = e.data;
  console.error('worker onmessage', e.data);
  if (type === 'start') {
    reportUrl = e.data.reportUrl;
    loop();
  }
};
