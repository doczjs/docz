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

export interface AnnotationsMap {
  [path: string]: NodeAST[]
}

interface ThemeComponents {
  [key: string]: React.ComponentType<any>
}

const getParams = (params: ParamAST[] = []) => {
  return params
    .map(p => {
      const signature = `${p.name}${p.optional ? '?' : ''}`
      const defValue =
        p.defaultvalue !== undefined ? ` = ${p.defaultvalue}` : ''
      return p.type
        ? `${signature}: ${p.type.names.join(' | ')}${defValue}`
        : `${signature}${defValue}`
    })
    .join(', ')
}

const getReturnTypes = (returnTypes: ReturnAST[] = []) => {
  return returnTypes
    .map(ret => {
      return ret.type ? ret.type.names.join(' | ') : ''
    })
    .join(', ')
}

const getSignature = (def: NodeAST) => {
  return `${def.name} (${getParams(def.params)}) => ${getReturnTypes(
    def.returns
  )}`
}

const findDefinition = (
  of: ComponentWithMeta,
  ann: AnnotationsMap
): NodeAST | null | undefined => {
  const { filename, name } = of.__docz
  if (!ann[filename]) return null
  return ann[filename].find(node => node.name === name)
}

type ComponentWithMeta = React.ComponentType & {
  __docz: {
    name: string
    filename: string
  }
}

interface Props {
  of: ComponentWithMeta
  from?: string
  components: ThemeComponents
}

const BaseAnnotations: React.SFC<Props> = ({ of, components }) => {
  const { inlineCode: Code, p: Paragraph } = components

  return (
    <state.Consumer select={[metadataSelector]}>
      {(metadata: Metadata) => {
        const def = findDefinition(of, metadata.annotations || {})
        if (!def) return 'Not found'
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
