import * as React from 'react'
import { Metadata, metadataSelector, state } from '../state'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'

interface ASTMeta {
  range: number[]
  lineno: number
  columnno: number
  path: string
  code: any
}

interface ASTParam {
  name: string
  type?: {
    names: string[]
  }
  optional?: boolean
  defaultValue?: any
  description?: string
}

interface ASTReturns {
  name: string
  type?: {
    names: string[]
  }
  description?: string
}

interface ASTNode {
  name: string
  description?: string
  comment?: string
  meta?: ASTMeta
  undocumented?: boolean
  params?: ASTParam[]
  returns?: ASTReturns
  longname: string
  kind: string
  memberof?: string
  scope?: string
}

export type JSDocAST = ASTNode[]

interface Props {
  of: string
  from?: string
}

const findDefinition = (name: string, ast: JSDocAST): ASTNode | undefined => {
  return ast.find(node => node.name === name)
}

const BaseJSDoc: React.SFC<Props> = (props) => {
  return (
    <state.Consumer select={[metadataSelector]}>
      {(metadata: Metadata) => {
        console.log(metadata)
        const def = findDefinition(props.of, metadata.jsdoc || [])
        if(!def) return 'Not found'
        return (
          <div>
            <div>{def.name}</div>
            <div>{def.description}</div>
          </div>
        )
      }}
    </state.Consumer>
  )
}

export const JSDoc = withMDXComponents(BaseJSDoc)