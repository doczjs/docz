/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Params {
  getState: () => Record<string, any>;
  setState: (key: string, val: any) => void;
}

type StartFn = (params: Params) => void;
type CloseFn = () => void;
type Opts = {
  start: StartFn;
  close: CloseFn;
};

export class State {
  public key!: string;
  public opts!: Opts;

  constructor(key: string, opts: Opts) {
    this.key = key;
    this.opts = opts;
  }

  public start(params: Params) {
    this.opts.start(params);
  }

  public close() {
    this.opts.close();
  }
}
