import { SFC, ReactNode, ComponentType } from 'react'

export interface Section {
  id: string
  title?: string
  render: () => ReactNode
}

export interface GroupConstructorArgs {
  name: string
}

export class Group {
  public constructor({ name }: GroupConstructorArgs)

  public route(value: string): Group
  public order(num: number): Group
  public toObject(): GroupObj

  public name: string
}

export interface GroupObj {
  id: string
  name: string
  order: number
  route: string
}

export interface DocConstructorArgs {
  name: string
}

export class Doc {
  public constructor({ name }: DocConstructorArgs)

  public order(num: number): Doc
  public group(group: Group): Doc
  public route(value: string): Doc
  public description(value: string): Doc
  public section(...args: any[]): Doc
  public toObject(): DocObj

  public name: string
}

export interface DocObj {
  readonly id: string
  readonly name: string
  readonly group: GroupObj | null
  readonly sections: Section[]
  readonly description: string | null
  readonly route: string
  readonly order: number
}

/**
 * Components
 */

export function createTheme(WrappedComponent: ComponentType): ComponentType

export interface DocsRenderProps {
  groups: GroupObj[]
  docs: DocObj[]
}

export interface DocsProps {
  children: ({ groups, docs }: DocsRenderProps) => ReactNode
}

export const Docs: SFC<DocsProps>

export function doc(name: string): Doc
export function group(name: string): Group
