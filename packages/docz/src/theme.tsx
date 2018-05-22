import * as React from 'react'
import { ComponentType as CT } from 'react'
import { BrowserRouter } from 'react-router-dom'

export type MSXComponent = CT<{
  components: { [key: string]: any }
}>

export interface MSXImport {
  default: MSXComponent
}

export interface Entry {
  id: string
  filepath: string
  slug: string
  route: string
  name: string
  menu: string | null
  order: number
}

export type EntryMap = Record<string, Entry>
export type ImportMap = Record<string, () => Promise<MSXImport>>

export interface DataContext {
  imports: ImportMap
  entries: EntryMap
}

const initialContext: DataContext = {
  imports: {},
  entries: {},
}

export const dataContext = React.createContext(initialContext)

export interface ThemeProps extends DataContext {
  wrapper: CT
  children(WrappedComponent: CT): JSX.Element
}

export function theme(WrappedComponent: CT): CT<ThemeProps> {
  const Theme: CT<ThemeProps> = props => {
    const { wrapper: Wrapper } = props

    return (
      <dataContext.Provider value={props}>
        <BrowserRouter>
          <Wrapper>
            <WrappedComponent />
          </Wrapper>
        </BrowserRouter>
      </dataContext.Provider>
    )
  }

  Theme.displayName = 'DoczTheme'
  return Theme
}
