import { Container } from 'unstated'
import { Doc, DocMap } from 'playgrodd'

interface DocsState {
  docs: DocMap | undefined
}

export class DocsContainer extends Container<DocsState> {
  constructor() {
    super()
    this.state = {
      docs: {},
    }
  }

  public addDoc(doc: Doc) {
    this.setState({
      docs: Object.assign({}, this.state.docs, {
        [`${doc.name}`]: doc,
      }),
    })
  }
}

export const docsContainer = new DocsContainer()
