import { Container } from 'unstated'
import { IDoc, IDocMap } from '../documents'

export interface DocumentState {
  documents: IDocMap | undefined
}

export class DocumentsContainer extends Container<DocumentState> {
  constructor() {
    super()
    this.state = {
      documents: {},
    }
  }

  public addDoc(doc: IDoc) {
    this.setState({
      documents: Object.assign({}, this.state.documents, {
        [`${doc.getName()}`]: doc,
      }),
    })
  }

  public getDocuments(): IDocMap | undefined {
    return this.state.documents
  }
}

export const container = new DocumentsContainer()
