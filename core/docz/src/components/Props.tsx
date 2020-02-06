import * as React from 'react'
import { SFC, ComponentType } from 'react'
import { get } from 'lodash/fp'

import { useComponents, useComponentProps } from '../hooks'
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
  [key: string]: any
}

export const getPropType = (prop: Prop) => {
  const propName = get('name', prop.flowType || prop.type)
  if (!propName) return null

  const isEnum = propName.startsWith('"') || propName === 'enum'
  const name = isEnum ? 'enum' : propName
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
  [key: string]: any
}

export const Props: SFC<PropsProps> = ({
  title,
  isToggle,
  isRaw,
  of: component,
  ...rest
}) => {
  const components = useComponents()
  const PropsComponent = components.props
  const fileName = get('__filemeta.filename', component)
  const filemetaName = get('__filemeta.name', component)
  const componentName =
    filemetaName || get('displayName', component) || get('name', component)

  const props = useComponentProps({ componentName, fileName })
  if (!PropsComponent) return null
  return (
    <PropsComponent
      title={title}
      isRaw={isRaw}
      isToggle={isToggle}
      props={props}
      getPropType={getPropType}
      of={component}
      {...rest}
    />
  )
}
