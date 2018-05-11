import * as React from 'react'
import { Fragment, SFC, ComponentType } from 'react'

export interface Prop {
  type: {
    name: string
  }
  required: boolean
  description?: string
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

export const PropsTable: SFC<PropsTable> = ({ of: component, components }) => {
  const info = component.__docgenInfo

  if (info && info.props && Object.keys(info.props).length === 0) {
    return null
  }

  const { props } = info
  const H2 = components.h2 || 'h2'
  const Table = components.table || 'table'
  const Thead = components.thead || 'thead'
  const Tr = components.tr || 'tr'
  const Th = components.th || 'th'
  const Tbody = components.tbody || 'tbody'
  const Td = components.td || 'td'

  return (
    <Fragment>
      <H2>Properties</H2>
      <Table class="PropsTable">
        <Thead>
          <Tr>
            <Th width="15%" class="PropsTable--property">
              Property
            </Th>
            <Th width="15%" class="PropsTable--type">
              Type
            </Th>
            <Th width="15%" class="PropsTable--required">
              Required
            </Th>
            <Th width="55%" class="PropsTable--description">
              Description
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {props &&
            Object.keys(props).map((name: string) => {
              const prop = props[name]

              return (
                <Tr key={name}>
                  <Td>{name}</Td>
                  <Td>{prop.type.name}</Td>
                  <Td>{String(prop.required)}</Td>
                  <Td>{prop.description}</Td>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
    </Fragment>
  )
}
