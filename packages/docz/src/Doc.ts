import { ulid } from 'ulid'
import { Section, DocConstructorArgs } from 'docz'
import { docsContainer } from './DocsContainer'
import kebabcase from 'lodash.kebabcase'

const isFn = (value: any): boolean => typeof value === 'function'

export class Doc {
  private _id: string
  private _name: string
  private _description: string | null
  private _sections: Section[]
  private _route: string
  private _order: number

  constructor({ name }: DocConstructorArgs) {
    this._id = ulid()
    this._name = name
    this._description = null
    this._sections = []
    this._route = `/${kebabcase(name)}`
    this._order = 0

    return this
  }

  // setters

  public description(value: string): Doc {
    this._description = value
    return this
  }

  public section(...args: any[]): Doc {
    const [title, renderMethod] = args
    const render = isFn(title) ? title : renderMethod

    this._sections.push({
      render,
      id: ulid(),
      ...(title && !isFn(title) && { title }),
    })

    return this
  }

  public route(value: string): Doc {
    this._route = kebabcase(value)
    return this
  }

  public order(num: number): Doc {
    this._order = num
    return this
  }

  // getters

  public get id(): string {
    return this._id
  }

  public get name(): string {
    return this._name
  }

  public get sections(): Section[] {
    return this._sections
  }

  public get docDescription(): string | null {
    return this._description
  }

  public get docRoute(): string {
    return this._route
  }

  public get docOrder(): number {
    return this._order
  }
}

export const doc = (name: string): Doc => {
  const newDoc = new Doc({ name })

  docsContainer.addDoc(newDoc)
  return newDoc
}
