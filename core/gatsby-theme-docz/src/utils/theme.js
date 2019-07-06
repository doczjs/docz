import { useThemeUI } from 'theme-ui'
import { get, pipe, defaultTo } from 'lodash/fp'

export const themeProp = str => props => {
  return get(`theme.${str}`, props)
}

export const usePrismTheme = () => {
  const { theme, colorMode } = useThemeUI()
  const getTheme = pipe(
    get('prismTheme'),
    defaultTo(get(`prism.${colorMode}`, theme))
  )
  return getTheme(theme)
}
