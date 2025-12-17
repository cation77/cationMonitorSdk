import { openDB, addStore, getAllStore, countStore, clearStore } from './db';
import request from './request';
import type { DBEnv, WorkerCommand } from './types';

const env: DBEnv = {
  db: null,
  dbName: 'cation-monitor-db',
  storeName: 'monitor-store'
};

let $timer = null;
let reportUrl = '';

// 发送所有数据并清空存储
const sendAllData = async () => {
  const dataList = await getAllStore(env.db!, env.storeName);
  if (dataList.length > 0) {
    console.log('worker sending data--->', dataList);
    request(dataList, reportUrl);
    await clearStore(env.db!, env.storeName);
  }
};

const loop = async () => {
  await sendAllData();
  $timer = setTimeout(() => {
    loop();
  }, 10000);
};

self.onmessage = async (e: MessageEvent<WorkerCommand>) => {
  const { type } = e.data;
  if (type === 'init') {
    reportUrl = e.data.reportUrl;
    env.db = await openDB(env.dbName, env.storeName);
    loop();
  } else if (type === 'report') {
    const { reportData } = e.data;
    await addStore(env.db!, env.storeName, reportData);

    // 检查数据数量，超过 10 条时直接发送
    const count = await countStore(env.db!, env.storeName);
    if (count >= 10) {
      await sendAllData();
    }
  }
};

export default self as any;
