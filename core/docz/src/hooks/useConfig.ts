import { useContext } from 'react'
import { merge } from 'lodash/fp'

import { doczState, ThemeConfig, Config } from '../state'

export interface UseConfigObj extends Config {
  themeConfig: ThemeConfig
  linkComponent?: React.ComponentType<any>
}

export const useConfig = (): UseConfigObj => {
  const state = useContext(doczState.context)
  const { linkComponent, transform, config, themeConfig = {} } = state
  const newConfig = merge(config ? config.themeConfig : {}, themeConfig)
  const transformed = transform ? transform(newConfig) : newConfig

  return {
    ...config,
    linkComponent,
    themeConfig: transformed,
  }
}
