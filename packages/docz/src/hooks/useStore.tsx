import { map } from "nanostores";

import { useNanoStore } from "./useNanoStore";

import type { Config, Entry, PropItem } from "~/types";

type Store = {
  entry: Entry;
  config: Config;
  props: PropItem[];
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
