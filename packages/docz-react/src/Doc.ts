/* tslint:disable:variable-name */
import { ulid } from 'ulid'
import kebabcase from 'lodash.kebabcase'

import { cache } from './Docs'
import { isFn, safeUrl } from './utils/helpers'
import { Section, DocObj, Entry } from '../'

export class Doc {
  private _name: string
  private _id: string | undefined
  private _filepath: string | undefined
  private _category: string | undefined
  private _description: string | null
  private _sections: Section[]
  private _route: string
  private _order: number

  constructor(name: string) {
    this._name = name
    this._description = null
    this._sections = []
    this._route = `/${kebabcase(name)}`
    this._order = 0

    return this
  }

  public category(category: string): Doc {
    this._category = category
    this._route = `/${kebabcase(category)}` + this._route

    return this
  }

  public order(num: number): Doc {
    this._order = num
    return this
  }

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
    this._route = safeUrl(path)
    return this
  }

  public findEntryAndMerge(entries: Entry[]): Doc {
    const entry = entries.find(entry => entry.name === this._name)

    if (entry) {
      this._id = entry.id
      this._filepath = entry.filepath
      this._sections.forEach((section, id) => {
        section.code = entry.sections[id]
      })
    }

    return this
  }

  public toObject(): DocObj {
    return {
      id: this._id,
      name: this._name,
      order: this._order,
      category: this._category,
      description: this._description,
      filepath: this._filepath,
      route: this._route,
      sections: this._sections,
    }
  }
}

export const doc = (name: string): Doc => {
  const newDoc = new Doc(name)

  cache.set(name, newDoc)
  return newDoc
}
