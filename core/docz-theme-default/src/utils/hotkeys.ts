import { useEffect } from 'react'
import hotkeys from 'hotkeys-js'

export const useHotkeys = (key: string, cb: () => any, inputs?: any[]) => {
  useEffect(() => {
    hotkeys(key, cb)
    return () => hotkeys.unbind(key)
  }, inputs)
}
