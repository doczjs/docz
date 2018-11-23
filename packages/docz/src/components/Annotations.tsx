import * as React from 'react'
import { SFC } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'
import { get } from 'lodash/fp'

import { state } from '../state'

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
  since?: string
  examples?: string[]
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

const findDef = (of: string, ann: NodeAST[]): NodeAST | undefined => {
  if (!Array.isArray(ann)) return undefined
  return ann.find(node => node.name === of)
}

type ComponentWithMeta = React.ComponentType & {
  __docz: {
    name: string
    filename: string
  }
}

interface WithDef {
  def: NodeAST
}

interface WithOf {
  of: ComponentWithMeta
}

interface Props {
  of: ComponentWithMeta
  annotations: AnnotationsMap
  components: ThemeComponents
}

const BaseAnnotations: React.SFC<Props> = ({ of, annotations, components }) => {
  const { inlineCode: Code, p: P, h3: H3, h4: H4, pre: Pre } = components
  const { name, filename } = of.__docz
  const fileAnns = get(filename, annotations) || []
  const def = findDef(name, fileAnns)

  if (!def) {
    return <P>Definition not found for {name}</P>
  }

  const Signature: SFC<WithDef> = ({ def }) => {
    return <Code>{getSignature(def)}</Code>
  }

  const Since: SFC<WithDef> = ({ def: { since } }) => {
    return since ? <P>Since: {since}</P> : null
  }

  const Examples: SFC<WithDef> = ({ def: { examples } }) => {
    if (!examples) return null
    return (
      <>
        {examples.map(eg => (
          <Pre key={eg}>{eg}</Pre>
        ))}
      </>
    )
  }

  const FunctionAnnotation: SFC<WithDef> = ({ def }) => (
    <div>
      <Signature def={def} />
      <Since def={def} />
      <P>{def.description}</P>
      <Examples def={def} />
    </div>
  )

  const ClassAnnotation: SFC<WithDef & WithOf> = ({ def, of }) => {
    const isMemberOfClass = (node: NodeAST) => node.memberof === name
    const properties = Object.getOwnPropertyNames(of.prototype)
    const membersAnns = fileAnns.filter(isMemberOfClass)

    return (
      <div>
        <H3>{def.name}</H3>
        <P>{def.description}</P>
        <H4>Methods</H4>
        {properties.map(prop => {
          const def = findDef(prop, membersAnns)
          if (!def) return null

          const ObjectAnnotation = getDefAnnotationType(def)
          return (
            <ObjectAnnotation
              key={prop}
              {...{ def, of: get(prop, of.prototype) }}
            />
          )
        })}
      </div>
    )
  }

  const getDefAnnotationType = (def: NodeAST) => {
    switch (def.kind) {
      case 'function':
        return FunctionAnnotation
      case 'class':
        return ClassAnnotation
      default:
        return FunctionAnnotation
    }
  }

  const ObjectAnnotation = getDefAnnotationType(def)
  return <ObjectAnnotation {...{ def, of }} />
}

type ProviderProps = Pick<Props, Exclude<keyof Props, 'annotations'>>

const AnnotationsProvider: React.SFC<ProviderProps> = props => (
  <>
    {state.get(({ metadata }) => {
      const annotations = get('annotations', metadata)
      return annotations ? (
        <BaseAnnotations {...props} annotations={annotations} />
      ) : null
    })}
  </>
)

export const Annotations = withMDXComponents(AnnotationsProvider)
