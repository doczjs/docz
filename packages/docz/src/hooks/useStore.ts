import { map } from 'nanostores';

import { useNanoStore } from './useNanoStore';

import type { Config, Page } from '~/types';

type Store = {
  page: Page;
  config: Config;
  components: Record<string, any>;
};

let initialStore: Store;
try {
  initialStore = (window as any).__DOCZ_INITIAL_STORE__;
} catch (error) {
  initialStore = {} as Store;
}

export const store = map<Store>(initialStore);

export function useStore() {
  return useNanoStore<Store>(store);
}
