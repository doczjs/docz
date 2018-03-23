import * as uuid from 'uuid'
import { container } from '../container'

const isFn = (value: any): boolean => typeof value === 'function'

export interface IRenderMethod {
  (): JSX.Element
}

export interface ISection {
  id: string
  render: IRenderMethod
  title?: string
}

export interface IDocArgs {
  name: string
}

export interface IDoc {
  description(value: string): Doc
  section(...args: any[]): Doc
  getName(): string
  getDescription(): string | null
  getSections(): ISection[]
}

export interface IDocMap {
  [key: string]: IDoc
}

export class Doc implements IDoc {
  private _name: string
  private _description: string | null
  private _sections: ISection[]

  constructor({ name }: IDocArgs) {
    this._name = name
    this._sections = []
    this._description = null

    container.addDoc(this)
    return this
  }

  // setters

  public description(value: string) {
    this._description = value
    return this
  }

  public section(...args: any[]) {
    const [title, renderMethod] = args
    const render: IRenderMethod = isFn(title) ? title : renderMethod

    if (!isFn(title) || !isFn(renderMethod)) {
      throw new Error(
        'You need to set a function that will render your section'
      )
    }

    this._sections.push({
      render,
      id: uuid.v4(),
      ...(title && !isFn(title) && { title }),
    })

    return this
  }

  // getters

  public getName() {
    return this._name
  }

  public getDescription() {
    return this._description
  }

  public getSections() {
    return this._sections
  }
}

export const doc = (name: string): Doc => new Doc({ name })
