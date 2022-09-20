import type { FSWatcher } from 'chokidar';

type Opts = {
  watcher: FSWatcher;
  onStart?: () => Promise<void>;
  onAll?: (filepath: string) => Promise<void>;
  onAdd?: (filepath: string) => Promise<void>;
  onChange?: (filepath: string) => Promise<void>;
  onDelete?: (filepath: string) => Promise<void>;
  onMove?: (filepath: string) => Promise<void>;
};

export class State {
  public key!: string;
  public opts!: Opts;
  private watcher!: FSWatcher;

  constructor(key: string, opts: Opts) {
    this.key = key;
    this.opts = opts;
    this.watcher = opts.watcher;
  }

  async start() {
    const { onAll, onAdd, onChange, onDelete, onMove, onStart } = this.opts;
    await onStart?.();
    onAll &&
      this.watcher.on('all', async (_action, filepath) => {
        await onAll(filepath);
      });
    onAdd && this.watcher.on('add', onAdd);
    onChange && this.watcher.on('change', onChange);
    onDelete && this.watcher.on('unlink', onDelete);
    onMove &&
      this.watcher.on(
        'raw',
        async (_event: string, filepath: string, details: any) => {
          if (details.event === 'moved' && details.type === 'directory') {
            await onMove(filepath);
          }
        }
      );
  }

  async close() {
    this.watcher.close();
  }
}
