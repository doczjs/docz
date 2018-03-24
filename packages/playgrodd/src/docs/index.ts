import { ulid } from 'ulid'
import { Section, DocConstructorArgs } from 'playgrodd'

import { container } from '../container'

const isFn = (value: any): boolean => typeof value === 'function'

export class Doc {
  private _id: string
  private _name: string
  private _description: string | null
  private _sections: Section[]

  constructor({ name }: DocConstructorArgs) {
    this._id = ulid()
    this._name = name
    this._sections = []
    this._description = null

    container.addDoc(this)
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

  // getters

  public get id(): string {
    return this._id
  }

  public get name(): string {
    return this._name
  }

  public get docDescription(): string | null {
    return this._description
  }

  public get sections(): Section[] {
    return this._sections
  }

  public get route(): string {
    return `/${this._name}`
  }
}

export const doc = (name: string): Doc => new Doc({ name })
