import { openDB, putStore, getStore } from './db';
import type { DBEnv, WorkerCommand } from './types';

const env: DBEnv = {
  db: null,
  dbName: 'cation-monitor-db',
  storeName: 'monitor-event'
};

let $timer = null;
let reportUrl = '';

const loop = async () => {
  const res = await getStore(env.db!, env.storeName, reportUrl);
  console.log('worker loop db--->', res);
  $timer = setTimeout(() => {
    loop();
  }, 10000);
};

self.onmessage = async (e: MessageEvent<WorkerCommand>) => {
  const { type } = e.data;
  console.error('worker onmessage', e.data);
  if (type === 'init') {
    reportUrl = e.data.reportUrl;
    env.db = await openDB(env.dbName, env.storeName);
    loop();
  } else if (type === 'report') {
    const { reportData } = e.data;
    putStore(env.db!, env.storeName, reportUrl, reportData);
  }
};

export default self as any;
