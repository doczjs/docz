import { SFC, ReactNode, ComponentType } from 'react'

declare module 'playgrodd' {
  export interface Section {
    id: string
    title?: string
    render: () => ReactNode
  }

  export interface DocArgs {
    name: string
  }

  export interface DocConstructorArgs {
    name: string
  }

  export class Doc {
    public id: string
    public name: string
    public docDescription: string | null
    public sections: Section[]
    public route: string

    public constructor({ name }: DocConstructorArgs)

    public description(value: string): Doc
    public section(...args: any[]): Doc
  }

  export interface DocMap {
    [key: string]: Doc
  }

  export type Docs = Doc[]

  /**
   * Components
   */

  export function createTheme(WrappedComponent: ComponentType): ComponentType

  export interface PreviewProps {
    children: (doc: Doc) => ReactNode
  }

  export const Preview: SFC<PreviewProps>

  export interface DocsProps {
    children: (docs: Doc[]) => ReactNode
  }

  export const Docs: SFC<DocsProps>
}
