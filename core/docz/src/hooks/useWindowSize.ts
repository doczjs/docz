import { useState, useEffect } from 'react'
import { throttle } from 'lodash/fp'

const isClient = typeof window === 'object'

const getSize = (initialWidth: number, initialHeight: number) => ({
  innerHeight: isClient ? window.innerHeight : initialHeight,
  innerWidth: isClient ? window.innerWidth : initialWidth,
  outerHeight: isClient ? window.outerHeight : initialHeight,
  outerWidth: isClient ? window.outerWidth : initialWidth,
})

export const useWindowSize = (
  throttleMs: number = 300,
  initialWidth = Infinity,
  initialHeight = Infinity
) => {
  const [windowSize, setWindowSize] = useState(
    getSize(initialHeight, initialHeight)
  )
  const tSetWindowResize = throttle(throttleMs, () =>
    setWindowSize(getSize(initialHeight, initialHeight))
  )

  useEffect(() => {
    window.addEventListener('resize', tSetWindowResize)
    return () => void window.removeEventListener('resize', tSetWindowResize)
  }, [])

  return windowSize
}
