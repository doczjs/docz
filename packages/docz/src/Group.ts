/* tslint:disable:variable-name */
import { ulid } from 'ulid'
import kebabcase from 'lodash.kebabcase'

import { GroupConstructorArgs, GroupObj } from '../'
import { safeUrl } from './utils/helpers'
import { docsContainer } from './DocsContainer'

class Group {
  private _id: string
  private _order: number
  private _name: string
  private _route: string

  constructor({ name }: GroupConstructorArgs) {
    this._id = ulid()
    this._name = name
    this._route = safeUrl(`/${kebabcase(name)}`)
    this._order = 0

    return this
  }

  public route(path: string): Group {
    this._route = safeUrl(path)
    return this
  }

  public order(num: number): Group {
    this._order = num
    return this
  }

  public toObject(): GroupObj {
    return {
      id: this._id,
      name: this._name,
      order: this._order,
      route: this._route,
    }
  }

  public get name(): string {
    return this._name
  }
}

export const group = (name: string): Group => {
  const newGroup = new Group({ name })

  docsContainer.addGroup(newGroup)
  return newGroup
}
