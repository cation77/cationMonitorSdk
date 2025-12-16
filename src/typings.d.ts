declare module '*.worker.ts' {
  class WorkerClass extends Worker {
    constructor();
  }
  export default WorkerClass;
}
