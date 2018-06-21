import * as React from 'react'
import { Fragment, SFC, ComponentType } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'

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
}

export interface Prop {
  required: boolean
  description?: string
  type: PropType
  defaultValue?: {
    value: string
    computed: boolean
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

const extractTypeDescribedValue = (type: PropType): string => {
  const { name, value } = type

  // instanceOf, computed shape, unknown enum
  if (typeof value === 'string') {
    return value
  }

  // oneOf, oneOfType
  if (Array.isArray(value)) {
    const values = value.map(valueType => {
      if (valueType.name === 'custom') return `custom(${valueType.raw})`
      return valueType.name || valueType.value
    })

    return values.join(' | ')
  }

  // arrayOf, objectOf
  if (typeof value === 'object' && name !== 'shape') {
    return value.name
  }

  // shape
  if (typeof value === 'object' && name === 'shape') {
    // show only keys due to a recursive limitation
    return `{ ${Object.keys(value).join(', ')} }`
  }

  // untreated
  return ''
}

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
    <Tooltip text={extractTypeDescribedValue(prop.type)}>{name}</Tooltip>
  )
}

const BasePropsTable: SFC<PropsTable> = ({ of: component, components }) => {
  const info = component.__docgenInfo
  const props = info && info.props

  if (!info || !props) {
    return null
  }

  const Table = components.table || 'table'
  const Thead = components.thead || 'thead'
  const Tr = components.tr || 'tr'
  const Th = components.th || 'th'
  const Tbody = components.tbody || 'tbody'
  const Td = components.td || 'td'
  const Tooltip = components.tooltip

  return (
    <Fragment>
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
                    {prop.defaultValue &&
                      prop.defaultValue.value.replace(/\'/g, '')}
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

export const PropsTable = withMDXComponents(BasePropsTable)
