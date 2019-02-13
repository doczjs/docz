import { useEffect, SFC } from 'react'
import useReactRouter from 'use-react-router'

export const ScrollToTop: SFC = (props: any) => {
  const { location } = useReactRouter()
  useEffect(() => window.scrollTo(0, 0), [location])
  return props.children
}
