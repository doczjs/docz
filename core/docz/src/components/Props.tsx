import * as React from 'react'
import { createElement, SFC, ComponentType, useMemo } from 'react'
import { assoc, first, get, mapValues } from 'lodash/fp'
import capitalize from 'capitalize'
import marksy from 'marksy'

import { doczState } from '../state'
import { useComponents } from '../hooks'
import { humanize } from '../utils/humanize-prop'

export interface EnumValue {
  value: string
  computed: boolean
}

export interface FlowTypeElement {
  name: string
  value: string
}

export interface FlowTypeArgs {
  name: string
  type: {
    name: string
  }
}

export interface PropType {
  name: string
  value?: any
  raw?: any
  computed?: boolean
}

export interface FlowType extends PropType {
  elements: FlowTypeElement[]
  name: string
  raw: string
  type?: string
  computed?: boolean
  signature?: {
    arguments: FlowTypeArgs[]
    return: {
      name: string
    }
  }
}

export interface Prop {
  required: boolean
  description?: string
  type: PropType
  defaultValue?: {
    value: string
    computed: boolean
  }
  flowType?: FlowType
}

export type ComponentWithDocGenInfo = ComponentType & {
  __docgenInfo: {
    description?: string
    props?: Record<string, Prop>
  }
}

export interface PropsProps {
  title?: Node
  isRaw?: boolean
  isToggle?: boolean
  of: ComponentWithDocGenInfo
}

export const getPropType = (prop: Prop) => {
  const propName = get('name', prop.flowType || prop.type)
  if (!propName) return null

  const isEnum = propName.startsWith('"') || propName === 'enum'
  const name = capitalize(isEnum ? 'enum' : propName)
  const value = get('type.value', prop)
  if (!name) return null

  if (
    (isEnum && typeof value === 'string') ||
    (!prop.flowType && !isEnum && !value) ||
    (prop.flowType && !prop.flowType.elements)
  ) {
    return name
  }

  return prop.flowType ? humanize(prop.flowType) : humanize(prop.type)
}

export interface PropsComponentProps {
  title?: Node
  isRaw?: boolean
  isToggle?: boolean
  props: Record<string, Prop>
  getPropType(prop: Prop): string
  of: ComponentWithDocGenInfo
}

export const Props: SFC<PropsProps> = ({
  title,
  isToggle,
  isRaw,
  of: component,
}) => {
  const components = useComponents()
  const { props: stateProps } = React.useContext(doczState.context)
  const PropsComponent = components.props
  const filename = get('__filemeta.filename', component)
  const filemetaName = get('__filemeta.name', component)
  const componentName =
    filemetaName || get('displayName', component) || get('name', component)

  const found =
    stateProps &&
    stateProps.length > 0 &&
    stateProps.find(
      item =>
        item.key.includes(`/${componentName}.`) || item.key.includes(filename)
    )

  const value = get('value', found) || []
  const firstDefinition = first(value)
  const definition = value.find((i: any) => i.displayName === componentName)

  const compile = useMemo(
    () => marksy({ createElement, elements: components }),
    [components]
  )

  const props = useMemo(() => {
    const props = get('props', definition || firstDefinition)
    const parseDescs = mapValues((prop: any) => {
      const desc = get('description', prop)
      return !desc ? prop : assoc('description', compile(desc).tree, prop)
    })

    return parseDescs(props)
  }, [compile, definition || firstDefinition])

  if (!props) return null
  if (!PropsComponent) return null
  return (
    <PropsComponent
      title={title}
      isRaw={isRaw}
      isToggle={isToggle}
      props={props}
      getPropType={getPropType}
      of={component}
    />
  )
}
