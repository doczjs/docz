import { useEffect } from 'react'
import hotkeys from 'hotkeys-js'

export const useHotkeys = (key: string, cb: () => any, inputs?: any[]) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      hotkeys(key, cb)
      return () => hotkeys.unbind(key)
    }
    return
  }, inputs)
}
