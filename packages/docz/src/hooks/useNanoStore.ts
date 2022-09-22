import type { MapStore } from 'nanostores';
import { listenKeys } from 'nanostores';
import { useCallback, useSyncExternalStore } from 'react';

export function useNanoStore<T extends object = any>(
  store: MapStore<T>,
  opts: any = {}
) {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof store === 'function') {
      throw new Error(
        'Use useStore(Template(id)) or useSync() ' +
          'from @logux/client/react for templates'
      );
    }
  }

  const sub = useCallback(
    (onChange: any) =>
      opts.keys
        ? listenKeys(store, opts.keys, onChange)
        : store.listen(onChange),
    [opts.keys, store]
  );

  const get = store.get.bind(store);
  return useSyncExternalStore(sub, get, get);
}
