import { Container } from 'unstated'

import { Doc, DocObj, LinksObj, Group, GroupObj } from '../'

export interface DocsState {
  docs: Map<string, Doc>
  groups: Map<string, Group>
}

export class DocsContainer extends Container<DocsState> {
  constructor() {
    super()
    this.state = {
      docs: new Map<string, Doc>(),
      groups: new Map<string, Group>(),
    }
  }

  public addDoc(doc: Doc): void {
    this.setState({
      docs: this.state.docs.set(doc.name, doc),
    })
  }

  public addGroup(group: Group): void {
    this.setState({
      groups: this.state.groups.set(group.name, group),
    })
  }

  public docsObject(): DocObj[] {
    return Array.from(this.state.docs.values()).map(doc => doc.toObject())
  }

  public links(): LinksObj {
    const sortByOrder = (a: DocObj | GroupObj, b: DocObj | GroupObj) =>
      b.order - a.order

    const docs: DocObj[] = Array.from(this.state.docs.values())
      .map(doc => doc.toObject())
      .sort(sortByOrder)

    const groups: GroupObj[] = Array.from(this.state.groups.values())
      .map(group => group.toObject())
      .sort(sortByOrder)

    return {
      docs,
      groups,
    }
  }
}

export const docsContainer = new DocsContainer()
