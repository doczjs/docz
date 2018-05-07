import React, { Component } from 'react'
import { entries } from './data'
import Promise from 'bluebird'
import produce from 'immer'

export class Docs extends Component {
  state = {
    docs: {},
  }

  importDocs = async imports => {
    const docs = await Promise.props(imports)

    this.setState({
      docs: produce(docs, draft => {
        Object.keys(draft).forEach(key => {
          const { default: component, meta: instance } = draft[key]
          const doc = instance.findEntryAndMerge(entries)
          const docObj = doc.toObject(component)

          draft[key] = docObj
        })
      }),
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (module.hot) {
      setImmediate(() => this.importDocs(nextProps.imports))
    }
  }

  componentDidMount() {
    this.importDocs(this.props.imports)
  }

  render() {
    return this.props.children(this.state.docs)
  }
}
