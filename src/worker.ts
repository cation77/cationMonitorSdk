// 创建 Worker 实例（仅在浏览器环境）
const worker =
  typeof window !== 'undefined' ? new Worker(new URL('./sender.worker.js', import.meta.url), { type: 'module' }) : null;

export default worker;
