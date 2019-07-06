import { useThemeUI } from 'theme-ui'
import { get } from 'lodash/fp'

export const themeProp = str => props => {
  return get(`theme.${str}`, props)
}

export const usePrismTheme = () => {
  const { theme, colorMode } = useThemeUI()
  return get(`prism.${colorMode}`, theme)
}
