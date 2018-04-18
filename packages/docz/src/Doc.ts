/* tslint:disable:variable-name */
import { ulid } from 'ulid'
import kebabcase from 'lodash.kebabcase'

import { isFn } from './utils/helpers'
import { Section, DocConstructorArgs, DocObj } from '../'
import { docsContainer } from './DocsContainer'

class Doc {
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

  /**
   * setters
   */

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

  public route(path: string): Doc {
    this._route = encodeURI(path.replace(/\s/g, ''))
    return this
  }

  public order(num: number): Doc {
    this._order = num
    return this
  }

  public get name(): string {
    return this._name
  }

  /**
   * getters
   */

  public toObject(): DocObj {
    return {
      description: this._description,
      id: this._id,
      name: this._name,
      order: this._order,
      route: this._route,
      sections: this._sections,
    }
  }
}

export const doc = (name: string): Doc => {
  const newDoc = new Doc({ name })

  docsContainer.addDoc(newDoc)
  return newDoc
}
