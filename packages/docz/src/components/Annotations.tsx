import * as React from 'react'
import { Metadata, metadataSelector, state } from '../state'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'

interface MetaAST {
  range: number[]
  lineno: number
  columnno: number
  path: string
  code: any
}

interface ParamAST {
  name: string
  type?: {
    names: string[]
  }
  optional?: boolean
  defaultvalue?: any
  description?: string
}

interface ReturnAST {
  name: string
  type?: {
    names: string[]
  }
  description?: string
}

interface NodeAST {
  name: string
  description?: string
  comment?: string
  meta?: MetaAST
  undocumented?: boolean
  params?: ParamAST[]
  returns?: ReturnAST[]
  longname: string
  kind: string
  memberof?: string
  scope?: string
}

export type AnnotationsAST = NodeAST[]

interface ThemeComponents {
  [key: string]: React.ComponentType<any>
}


const findDefinition = (name: string, ast: AnnotationsAST): NodeAST | undefined => {
  return ast.find(node => !node.undocumented && node.name === name)
}

const getParams = (params: ParamAST[] = []) => {
  return params.map(p => {
    const signature = `${p.name}${p.optional ? '?' : ''}`
    const defValue = p.defaultvalue !== undefined ? ` = ${p.defaultvalue}` : ''
    return p.type ?
      `${signature}: ${p.type.names.join(' | ')}${defValue}` :
      `${signature}${defValue}`
  }).join(', ')
}

const getReturnTypes = (returnTypes: ReturnAST[] = []) => {
  return returnTypes.map(ret => {
    return ret.type ?
      ret.type.names.join(' | ') :
      ''
  }).join(', ')
}

const getSignature = (def: NodeAST) => {
  return `${def.name} (${getParams(def.params)}) => ${getReturnTypes(def.returns)}`
}

interface Props {
  of: string
  from?: string
  components: ThemeComponents
}

const BaseAnnotations: React.SFC<Props> = ({ of, components }) => {
  return (
    <state.Consumer select={[metadataSelector]}>
      {(metadata: Metadata) => {
        console.log(metadata.annotations)
        const { inlineCode: Code, p: Paragraph } = components
        const def = findDefinition(of, metadata.annotations || [])
        if(!def) {
          console.warn(`Annotation not found for: ${of}`);
          return null
        }
        return (
          <div>
            <Code>{getSignature(def)}</Code>
            <Paragraph>{def.description}</Paragraph> 
          </div>
        )
      }}
    </state.Consumer>
  )
}

export const Annotations = withMDXComponents(BaseAnnotations)
