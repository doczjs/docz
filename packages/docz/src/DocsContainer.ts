import { Container } from 'unstated'

import { Doc } from '../'

interface DocsState {
  docs: Doc[]
}

export class DocsContainer extends Container<DocsState> {
  constructor() {
    super()
    this.state = {
      docs: [],
    }
  }

  public addDoc(doc: Doc): void {
    this.setState({
      docs: this.state.docs.concat([doc]),
    })
  }
}

export const docsContainer = new DocsContainer()
