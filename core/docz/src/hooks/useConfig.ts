import { useContext } from 'react';
import merge from 'deepmerge'

import { doczState, ThemeConfig as ThemeConfigObj } from '../state'

export const useConfig = (): ThemeConfigObj => {
  const state = useContext(doczState.context)
  const { linkComponent, transform, config, themeConfig = {} } = state
  const newConfig = merge(themeConfig, config ? config.themeConfig : {})
  const transformed = transform ? transform(newConfig) : newConfig

  return {
    ...config,
    linkComponent,
    themeConfig: transformed,
  }
}
