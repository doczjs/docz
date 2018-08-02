import { ComponentType as CT } from 'react'
import createState from 'react-copy-write'

import { ComponentsMap } from './components/DocPreview'

export type MSXComponent = CT<{
  components: ComponentsMap
}>

export interface MSXImport {
  default: MSXComponent
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

export interface Config {
  [key: string]: any
}

export type EntryMap = Record<string, Entry>
export type ImportMap = Record<string, () => Promise<MSXImport>>
export type TransformFn = (config: Config) => Config

export interface Database {
  config: Config
  entries: EntryMap
}

export interface State {
  db: Database
  imports: ImportMap
}

export const state = createState({
  imports: {},
  db: {
    config: {},
    entries: {},
  },
})
