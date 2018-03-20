import { Container } from 'unstated'

import { Doc } from './'

export interface DocumentState {
  documents: Doc[]
}

export class DocumentsContainer extends Container<DocumentState> {
  state = {
    documents: [],
  }

  public add(document: Doc) {
    this.setState({
      documents: [document, ...this.state.documents],
    })
  }
}

export const container = new DocumentsContainer()
