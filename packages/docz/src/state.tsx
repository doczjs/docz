import { AnnotationsAST } from './components/Annotations'
import { ComponentsMap } from './components/DocPreview'

import { create } from './utils/createState'

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

export interface MenuItem {
  id: string
  name: string
  route?: string
  href?: string
  menu?: MenuItem[]
  order?: number
}

export interface Config {
  title: string
  description: string
  ordering: string
  themeConfig: ThemeConfig
  menu: MenuItem[]
  version: string | null
  repository: string | null
  native: boolean
}

export interface Metadata {
  annotations?: AnnotationsMap
}

type Import = () => Promise<MSXImport>

export type EntryMap = Record<string, Entry>
export type TransformFn = (config: ThemeConfig) => ThemeConfig

export interface State {
  config?: Config
  entries?: EntryMap
  themeConfig?: ThemeConfig
  transform?: TransformFn
  metadata: Metadata
}

export const state = create<State>()
