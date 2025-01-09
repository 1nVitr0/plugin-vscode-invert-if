import InvertIfServiceProvider from './providers/InvertIfServiceProvider';

const prefixLog = <T>(message: string, ...args: T[]) => {
  const timestamp = new Date().toISOString().replace("T", " ").replace("Z", "");
  return [`[${timestamp}] [Invert If] ${message}`, ...args];
};

export const service = new InvertIfServiceProvider();
export const logger = {
  log: (message: string, ...args: any[]) => console.log(...prefixLog(message, ...args)),
  error: (message: string, ...args: any[]) => console.error(...prefixLog(message, ...args)),
  warn: (message: string, ...args: any[]) => console.warn(...prefixLog(message, ...args)),
  info: (message: string, ...args: any[]) => console.info(...prefixLog(message, ...args)),
};