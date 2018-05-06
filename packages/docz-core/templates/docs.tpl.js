import React, { Component } from 'react'
import data from './data.json'

const mergeDocsWithEntries = (docs, entries) =>
  docs
    .map(doc => {
      const Component = doc.default
      const instance = doc.meta.findEntryAndMerge(entries)

      return instance.toObject(Component)
    })
    .sort((docA, docB) => docB.order - docA.order)

export class Docs extends Component {
  state = {
    docs: [],
  }

  importDocs = () =>
    Promise.all(this.props.imports).then(docs =>
      this.setState({
        docs: mergeDocsWithEntries(docs, data.entries),
      })
    )

  componentWillReceiveProps() {
    if (module.hot) {
      setImmediate(this.importDocs)
    }
  }

  componentDidMount() {
    this.importDocs()
  }

  render() {
    return this.props.children(this.state.docs)
  }
}
