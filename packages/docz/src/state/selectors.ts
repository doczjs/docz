import { state, State, ThemeConfig, TransformFn } from './'

export const entries = state.createSelector((s: State) => s.entries)
export const config = state.createSelector((state: State) => state.config)

export const imports = state.createSelector((s: State) => s.imports)

export interface ThemeSelector {
  themeConfig: ThemeConfig
  transform: TransformFn
}

export const theme = state.createSelector((s: State) => ({
  themeConfig: s.themeConfig,
  transform: s.transform,
}))
