import { SFC, ReactNode, ComponentType } from 'react'

export interface Section {
  id: string
  title?: string
  render: () => ReactNode
}

export interface DocConstructorArgs {
  name: string
}

export class Doc {
  public constructor({ name }: DocConstructorArgs)

  public description(value: string): Doc
  public section(...args: any[]): Doc
  public route(value: string): Doc
  public order(num: number): Doc
  public toObject(): DocObj

  public name: string
}

export interface DocObj {
  readonly id: string
  readonly name: string
  readonly sections: Section[]
  readonly description: string | null
  readonly route: string
  readonly order: number
}

/**
 * Components
 */

export function createTheme(WrappedComponent: ComponentType): ComponentType

export interface PreviewProps {
  children: (doc: DocObj) => ReactNode
}

export const Preview: SFC<PreviewProps>

export interface DocsProps {
  children: (docs: DocObj[]) => ReactNode
}

export const Docs: SFC<DocsProps>
