import * as React from 'react'
import { CSSProperties, Fragment, SFC, ComponentType } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'
import { last, get } from 'lodash/fp'
import capitalize from 'capitalize'

import { doczState } from '../state'
import { humanize } from '../utils/humanize-prop'

export interface StylesMap {
  [s: string]: CSSProperties
}

const styles: StylesMap = {
  thead: {
    textAlign: 'left',
  },
}

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

export const getPropType = (prop: Prop, Tooltip?: TooltipComponent) => {
  const propName = prop.flowType ? prop.flowType.name : prop.type.name
  const isEnum = propName.startsWith('"') || propName === 'enum'
  const name = capitalize(isEnum ? 'enum' : propName)
  const value = prop.type && prop.type.value

  if (!name) return null

  if (
    !Tooltip ||
    (isEnum && typeof value === 'string') ||
    (!prop.flowType && !isEnum && !value) ||
    (prop.flowType && !prop.flowType.elements)
  ) {
    return name
  }

  return prop.flowType ? (
    <Tooltip text={humanize(prop.flowType)}>{name}</Tooltip>
  ) : (
    <Tooltip text={humanize(prop.type)}>{name}</Tooltip>
  )
}

const BasePropsTable: SFC<PropsTable> = ({ of: component, components }) => {
  const { props: stateProps } = React.useContext(doczState.context)
  const filename = get('__filemeta.filename', component)
  const found =
    stateProps &&
    stateProps.length > 0 &&
    stateProps.find(item => item.key === filename)

  const definition: any = last(found ? found.value : [])
  const props = get('props', definition)

  if (!props) return null

  const hasDescription = Object.keys(props).some((name: string) => {
    const description = get(`${name}.description`, props)
    return Boolean(description) && Boolean(get('length', description))
  })

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
        <Thead style={styles.thead}>
          <Tr>
            <Th className="PropsTable--property">Property</Th>
            <Th className="PropsTable--type">Type</Th>
            <Th className="PropsTable--required">Required</Th>
            <Th className="PropsTable--default">Default</Th>
            {hasDescription && (
              <Th width="40%" className="PropsTable--description">
                Description
              </Th>
            )}
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
                  {!prop.defaultValue ? (
                    <Td>
                      <em>-</em>
                    </Td>
                  ) : (
                    <Td>
                      {prop.defaultValue.value === "''" ? (
                        <em>[Empty String]</em>
                      ) : (
                        prop.defaultValue &&
                        prop.defaultValue.value.replace(/\'/g, '')
                      )}
                    </Td>
                  )}
                  {hasDescription && (
                    <Td>{prop.description && prop.description}</Td>
                  )}
                </Tr>
              )
            })}
        </Tbody>
      </Table>
    </Fragment>
  )
}

export const PropsTable = withMDXComponents(BasePropsTable)
