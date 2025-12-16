export interface BaseError {
  message: string;
  projectName: string;
  environment: string;
  timestamp: string;
}

export interface JSError extends BaseError {
  type: 'JavaScript Error';
  stack?: string | null;
  source: any;
  lineno: any;
  colno: any;
}

export interface PromiseError extends BaseError {
  type: 'unhandled Promise Rejection';
  stack?: string | null;
}

export interface ResourceError extends BaseError {
  type: 'Resource Load Error';
  url: string | null;
  tagName: string | null;
  outerHTML: string | null;
}

export interface NetworkError extends BaseError {
  type: 'Network Error' | 'Fetch Error';
  url: string | null;
}

export interface VueError extends BaseError {
  type: 'Vue Error';
  stack?: string | null;
  instance?: unknown;
  info?: unknown;
}

export interface ReactError extends BaseError {
  type: 'React Error';
  stack?: string | null;
  componentStack?: string | null;
}

export type MonitorData = JSError | PromiseError | ResourceError | NetworkError | VueError | ReactError;

export type WorkerCommand = { type: 'init'; reportUrl: string } | { type: 'report'; reportData: MonitorData[] };

export type DBEnv = {
  db: IDBDatabase | null;
  dbName: string;
  storeName: string;
};
