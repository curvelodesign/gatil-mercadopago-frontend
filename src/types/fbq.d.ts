
interface FbqFunction {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: FbqFunction;
  loaded: boolean;
  version: string;
  disablePushState?: boolean;
}

interface Window {
  fbq?: FbqFunction;
  _fbq?: FbqFunction;
}
