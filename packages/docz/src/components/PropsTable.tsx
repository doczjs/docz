import * as React from 'react'
import { Fragment, SFC, ComponentType } from 'react'

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

export interface Prop {
  required: boolean
  description?: string
  type: {
    name: string
    value?: EnumValue[]
  }
  defaultValue?: {
    value: string
  }
  flowType?: {
    elements: FlowTypeElement[]
    name: string
    raw: string
    type?: string
    signature?: {
      arguments: FlowTypeArgs[]
      return: {
        name: string
      }
    }
  }
}

export type ComponentWithDocGenInfo = ComponentType & {
  __docgenInfo: {
    description?: string
    props?: Record<string, Prop>
  }
}

export interface PropsTable {
  of: ComponentWithDocGenInfo
  components: {
    [key: string]: ComponentType<any>
  }
}

export type TooltipComponent = React.ComponentType<{
  text: React.ReactNode
  children: React.ReactNode
}>

const getValue = (value: string) => value.replace(/\'/g, '')

const getPropType = (prop: Prop, Tooltip?: TooltipComponent) => {
  const name = prop.flowType ? prop.flowType.name : prop.type.name
  const value = prop.type && prop.type.value

  if (!name) return null
  if (!Tooltip) return name
  if ((!prop.flowType && !value) || (prop.flowType && !prop.flowType.elements))
    return name

  return prop.flowType ? (
    <Tooltip text={prop.flowType.raw}>{name}</Tooltip>
  ) : (
    <Tooltip text={value && value.map(val => getValue(val.value)).join(' | ')}>
      {name}
    </Tooltip>
  )
}

export const PropsTable: SFC<PropsTable> = ({ of: component, components }) => {
  const info = component.__docgenInfo
  const props = info && info.props

  if (!info || !props) {
    return null
  }

  const H2 = components.h2 || 'h2'
  const Table = components.table || 'table'
  const Thead = components.thead || 'thead'
  const Tr = components.tr || 'tr'
  const Th = components.th || 'th'
  const Tbody = components.tbody || 'tbody'
  const Td = components.td || 'td'
  const Tooltip = components.tooltip

  return (
    <Fragment>
      <H2>Properties</H2>
      <Table className="PropsTable">
        <Thead>
          <Tr>
            <Th className="PropsTable--property">Property</Th>
            <Th className="PropsTable--type">Type</Th>
            <Th className="PropsTable--required">Required</Th>
            <Th className="PropsTable--description">Default</Th>
            <Th width="40%" className="PropsTable--description">
              Description
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {props &&
            Object.keys(props).map((name: string) => {
              const prop = props[name]

              if (!prop.flowType && !prop.type) return null
              return (
                <Tr key={name}>
                  <Td>{name}</Td>
                  <Td>{getPropType(prop, Tooltip)}</Td>
                  <Td>{String(prop.required)}</Td>
                  <Td>
                    {prop.defaultValue && getValue(prop.defaultValue.value)}
                  </Td>
                  <Td>{prop.description && prop.description}</Td>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
    </Fragment>
  )
}
