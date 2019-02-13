import { useState, useEffect } from 'react'
import { throttle } from 'lodash/fp'

const getSize = () => ({
  innerHeight: window.innerHeight,
  innerWidth: window.innerWidth,
  outerHeight: window.outerHeight,
  outerWidth: window.outerWidth,
})

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getSize())
  const tSetWindowResize = throttle(300, () => setWindowSize(getSize()))

  useEffect(() => {
    window.addEventListener('resize', tSetWindowResize)
    return () => void window.removeEventListener('resize', tSetWindowResize)
  }, [])

  return windowSize
}
