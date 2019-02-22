import * as React from 'react'
import { SFC, ComponentType } from 'react'
import { useState, useEffect } from 'react'

import { isFn } from '../utils/helpers'

interface Props {
  as: ComponentType<any>
  getInitialProps?: (props: any) => any
}

export const AsyncComponent: SFC<Props> = defaultProps => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({})

  useEffect(() => {
    const { getInitialProps } = defaultProps

    if (getInitialProps && isFn(getInitialProps)) {
      setLoading(true)
      getInitialProps(defaultProps)
        .then((data: any) => {
          setLoading(false)
          setError(null)
          setData(data)
        })
        .catch((err: any) => {
          setLoading(false)
          setError(err)
          setData({})
        })
    }
  }, [])

  const { as: Comp, getInitialProps, ...props } = defaultProps
  return <Comp {...props} data={{ ...data, loading, error }} />
}
