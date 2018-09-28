import * as React from 'react'
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

type ComponentWithMeta = React.ComponentType & {
  __docz: {
    jsdoc: NodeAST | null
  }
}

interface Props {
  of: ComponentWithMeta
  from?: string
  components: ThemeComponents
}

const BaseAnnotations: React.SFC<Props> = ({ of, components }) => {
  const def = of.__docz.jsdoc
  const { inlineCode: Code, p: Paragraph } = components

  if (!def) {
    console.warn(`Annotation not found for: ${of}`)
    return null
  }
  return (
    <div>
      <Code>{getSignature(def)}</Code>
      <Paragraph>{def.description}</Paragraph>
    </div>
  )
}

export const Annotations = withMDXComponents(BaseAnnotations)
