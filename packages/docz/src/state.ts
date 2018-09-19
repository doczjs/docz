import { ComponentType as CT } from 'react'
import createState from 'react-copy-write'
import { AnnotationsAST } from './components/Annotations'
import { ComponentsMap } from './components/DocPreview'

export type MSXComponent = CT<{
  components: ComponentsMap
}>

export interface MSXImport {
  default: MSXComponent
  getInitialData?: (props: any) => any
}

export interface Heading {
  depth: number
  slug: string
  value: string
}

export interface Entry {
  id: string
  filepath: string
  slug: string
  route: string
  name: string
  order: number
  menu: string | null
  headings: Heading[]
  [key: string]: any
}

export interface ThemeConfig {
  [key: string]: any
}

export interface Config {
  title: string
  description: string
  ordering: string
  themeConfig: ThemeConfig
  version: string | null
  repository: string | null
}

export interface Metadata {
  annotations?: AnnotationsAST
}

type Import = () => Promise<MSXImport>

export type EntryMap = Record<string, Entry>
export type ImportMap = Record<string, Import>
export type TransformFn = (config: Config) => Config

export interface State {
  config: Config
  entries: EntryMap
  metadata: Metadata
}

export const state = createState({
  config: {},
  entries: {},
  metadata: {}
})

export const metadataSelector = state.createSelector((s: State) => s.metadata)
