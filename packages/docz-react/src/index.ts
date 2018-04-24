import * as ReactDOM from 'react-dom'
import { Doc } from 'docz/doc'
import { cache } from './Docs'

export { theme } from './theme'
export { Docs } from './Docs'
export { DocObj, Section } from 'docz/doc'

const render = (child: any, container: HTMLElement) =>
  ReactDOM.createPortal(child(), container)

export const doc = (name: string): Doc => {
  const newDoc = new Doc(name, render)

  cache.set(name, newDoc)
  return newDoc
}
