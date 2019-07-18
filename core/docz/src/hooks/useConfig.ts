import { useContext } from 'react'
import { merge } from 'lodash/fp'

import { doczState, ThemeConfig, Config } from '../state'

export interface UseConfigObj extends Config {
  themeConfig: ThemeConfig
}

export const useConfig = (): UseConfigObj => {
  const state = useContext(doczState.context)
  const { transform, config, themeConfig = {} } = state
  const newConfig = merge(themeConfig, config ? config.themeConfig : {})
  const transformed = transform ? transform(newConfig) : newConfig

  return {
    ...config,
    themeConfig: transformed,
  }
}
