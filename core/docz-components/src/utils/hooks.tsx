import { useEffect } from 'react'

export const useScrollLock = (): void => {
  useEffect(() => {
    if(document !== undefined){
      document.body.style.overflow = 'hidden'
    }
    return () => {
      if(document !== undefined) {
        document.body.style.overflow = 'unset'
      }
    }
  }, []);
}

export const useEscape = (callback: () => void): void => {
  const keydownCallback = (event: any): void => {
    if(event.keyCode === 27){
      callback();
    }
    return
  }
  useEffect(() => {
    if(document !== undefined){
      document.addEventListener('keydown', keydownCallback, true)
    }
    return () => {
      if(document !== undefined) {
        document.removeEventListener('keydown', keydownCallback, true)
      }
    }
  }, [])
}