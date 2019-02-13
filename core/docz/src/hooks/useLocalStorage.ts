const checkWindow = () => {
  if (!window || typeof window === 'undefined') return
}

export interface LocalStorage {
  get(key: string): string | null | undefined
  set(key: string, val: string): void
  remove(key: string): void
}

const localStorage = (): LocalStorage => ({
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

const storage = localStorage()
export const useLocalStorage = () => {
  const get = (pos: number): any => storage.get(pos.toString())
  const remove = (pos: number): void => storage.remove(pos.toString())
  const set = (pos: number, size: string): void =>
    storage.set(pos.toString(), size)

  return { get, remove, set }
}
