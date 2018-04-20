import { SFC, ReactNode, ComponentType } from 'react'

export interface Section {
  id: string
  title?: string
  code?: string
  render: () => ReactNode
}

export interface DocConstructorArgs {
  name: string
}

export interface DocObj {
  readonly name: string
  readonly route: string
  readonly id: string | undefined
  readonly order: number
  readonly description: string | null
  readonly filepath: string | undefined
  readonly category: string | undefined
  readonly sections: Section[]
}

export class Doc {
  public constructor(name: string)
  public order(num: number): Doc
  public category(name: string): Doc
  public route(value: string): Doc
  public description(value: string): Doc
  public section(...args: any[]): Doc
  public toObject(): DocObj
}

export interface Entry {
  id: string
  name: string
  filepath: string
  importPath: string
  sections: string[]
}

/**
 * Components
 */

export interface DocsRenderProps {
  docs: DocObj[]
  categories: string[]
}

export interface DocsProps {
  children: (renderProps: DocsRenderProps) => ReactNode
}

/**
 * Api
 */

export function doc(name: string): Doc
export function theme(WrappedComponent: ComponentType): ComponentType
export const Docs: SFC<DocsProps>
