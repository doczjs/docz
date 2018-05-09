import * as React from 'react'
import { Component, ComponentType as CT } from 'react'
import Promise from 'bluebird'

import { docsContext } from './components/Docs'
import { Doc, DocObj, Entry } from './Doc'

export interface MSXImport {
  default: CT
  meta: Doc
}

export type DocMap = Record<string, DocObj>
export type EntryMap = Record<string, Entry>
export type ImportMap = Record<string, Promise<MSXImport>>

declare const module: any

export interface ThemeProps {
  imports: ImportMap
  data: {
    title: string
    description: string
    theme: string
    entries: EntryMap
  }

  wrapper: CT
  children(WrappedComponent: CT): JSX.Element
}

export interface ThemeState {
  docs: DocMap
}

export function theme(WrappedComponent: CT): CT<ThemeProps> {
  return class Theme extends Component<ThemeProps, ThemeState> {
    public state = {
      docs: {},
    }

    public importDocs = async (imports: ImportMap, entries: EntryMap) => {
      const docs = await Promise.props(imports)

      this.setState({
        docs: Object.keys(docs).reduce((obj, key) => {
          const { default: component, meta: instance } = docs[key]
          const doc = instance.findEntryAndMerge(entries)
          const docObj = doc.toObject(component)

          return {
            ...obj,
            [key]: docObj,
          }
        }, {}),
      })
    }

    public UNSAFE_componentWillReceiveProps(nextProps: ThemeProps): void {
      if (module.hot) {
        setImmediate(() =>
          this.importDocs(nextProps.imports, nextProps.data.entries)
        )
      }
    }

    public componentDidMount(): void {
      const { imports, data } = this.props
      this.importDocs(imports, data.entries)
    }

    public render(): JSX.Element {
      const { wrapper: Wrapper } = this.props

      return (
        <docsContext.Provider value={this.state.docs}>
          <Wrapper>
            <WrappedComponent />
          </Wrapper>
        </docsContext.Provider>
      )
    }
  }
}
