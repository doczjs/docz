const checkWindow = () => {
  if (!window || typeof window === 'undefined') return
}

export interface LocalStorage {
  get(key: string): string | null | undefined
  set(key: string, val: string): void
  remove(key: string): void
}

export const localStorage = (): LocalStorage => ({
  get: (key: string) => {
    checkWindow()
    return window.localStorage.getItem(key)
  },
  set: (key: string, val: string) => {
    checkWindow()
    window.localStorage.setItem(key, val)
  },
  remove: (key: string) => {
    checkWindow()
    window.localStorage.removeItem(key)
  },
})
