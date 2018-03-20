import invariant from 'invariant'
import { v4 } from 'uuid'

export { Preview } from '../components/Preview'
export { Playgrodd } from '../components/Playgrodd'

import { container } from './container'

const isFn = (value: any): boolean => typeof value === 'function'

export interface IRenderMethod {
  (): JSX.Element
}

export interface ISection {
  id: string
  render: IRenderMethod
  title?: string
}

export class Doc {
  private _name: string
  private _description: string | null
  private _sections: ISection[]

  constructor(name: string) {
    this._name = name
    this._sections = []
    this._description = null

    container.add(this)
    return this
  }

  // setters

  description(value: string) {
    this._description = value
    return this
  }

  section(...args: any[]) {
    const [title, renderMethod] = args
    const render: IRenderMethod = isFn(title) ? title : renderMethod

    invariant(
      !isFn(title) || !isFn(renderMethod),
      'You need to set a function that will be render your sectoin'
    )

    this._sections.push({
      render,
      id: v4(),
      ...(title && !isFn(title) && { title }),
    })

    return this
  }

  // getters

  public getName(): string {
    return this._name
  }

  public getDescription(): string | null {
    return this._description
  }

  public getSections(): ISection[] {
    return this._sections
  }
}

export interface IDoc {
  (name: string): Doc
}

export const doc: IDoc = name => new Doc(name)
