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

export interface MenuItem {
  id: string
  name: string
  route?: string
  href?: string
  menu?: MenuItem[]
  order?: number
  parent?: string
  [key: string]: any
}

export type ThemeConfig = Record<string, any>
export interface Config {
  title: string
  description: string
  themeConfig: ThemeConfig
  menu: MenuItem[]
  version: string | null
  repository: string | null
  native: boolean
  separator: string
  base?: string
}

export type Entries = { key: string; value: Entry }[]
export type Props = { key: string; value: any }[]
export type TransformFn = (config: ThemeConfig) => ThemeConfig

export interface Database {
  config: Config
  currentEntry: Entry
  props?: Props
  entries?: Entries
}

export interface DoczState extends Database {
  themeConfig?: ThemeConfig
  transform?: TransformFn
}

export const doczState = create<DoczState>({} as any)
