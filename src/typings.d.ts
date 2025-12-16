declare module '*.worker.ts' {
  // 扩展 Worker 类型（兼容 ESM）
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
