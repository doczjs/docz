import { Container } from 'unstated'

import { Doc } from '../'

export interface DocsState {
  docs: Map<string, Doc>
}

export class DocsContainer extends Container<DocsState> {
  constructor() {
    super()
    this.state = {
      docs: new Map<string, Doc>(),
    }
  }

  public addDoc(doc: Doc): void {
    this.setState({
      docs: this.state.docs.set(doc.name, doc),
    })
  }
}

export const docsContainer = new DocsContainer()
