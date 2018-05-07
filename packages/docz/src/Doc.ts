/* tslint:disable:variable-name */
import { ComponentType } from 'react'
import slugify from '@sindresorhus/slugify'
import pascalcase from 'pascalcase'

export const isFn = (value: any): boolean => typeof value === 'function'
export const safeUrl = (value: string) => encodeURI(value.replace(/\s/g, ''))

export type MDXComponent = ComponentType<{
  components?: Record<string, ComponentType>
}>

export interface DocConstructorArgs {
  name: string
}

export interface DocObj {
  readonly id: string | undefined
  readonly name: string
  readonly slug: string
  readonly route: string
  readonly order: number
  readonly filepath: string | undefined
  readonly category: string | undefined
  readonly component: MDXComponent
}

export interface Entry {
  id: string
  name: string
  filepath: string
}

export class Doc {
  static categoriesFromDocs = (docs: DocObj[]) =>
    docs.reduce(
      (arr: string[], { category }: DocObj) =>
        category && arr.indexOf(category) === -1 ? arr.concat([category]) : arr,
      []
    )

  private _name: string
  private _slug: string
  private _route: string
  private _id: string | undefined
  private _order: number
  private _filepath: string | undefined
  private _category: string | undefined

  constructor(name: string) {
    const slug = slugify(name)

    this._name = name
    this._slug = slug
    this._route = `/${slug}`
    this._order = 0

    return this
  }

  public category(category: string): Doc {
    this._category = category
    this._route = `/${slugify(category)}` + this._route

    return this
  }

  public order(num: number): Doc {
    this._order = num
    return this
  }

  public route(path: string): Doc {
    this._route = safeUrl(path)
    return this
  }

  public findEntryAndMerge(entries: Record<string, Entry>): Doc {
    const entry = Object.values(entries).find(
      entry => entry.name === this._slug
    )

    if (entry) {
      this._id = entry.id
      this._filepath = entry.filepath
    }

    return this
  }

  public toObject(Component: MDXComponent): DocObj {
    Component.displayName = pascalcase(this._name)

    return {
      component: Component,
      id: this._id,
      name: this._name,
      slug: this._slug,
      filepath: this._filepath,
      route: this._route,
      order: this._order,
      category: this._category,
    }
  }
}

export const doc = (name: string): Doc => new Doc(name)
