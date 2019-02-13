import { useEffect, useRef } from 'react'

export const usePrevious = (value: any, defaultValue?: any) => {
  const ref = useRef(defaultValue)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
