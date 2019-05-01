import * as React from 'react'
import { useMemo } from 'react'
import { PropsComponentProps, useComponents } from 'docz'
import styled from 'styled-components'

import { get } from '~utils/theme'

const breakpoint = '600px'

const Container = styled.div`
  border: 1px solid ${get('colors.border')};
  border-radius: 4px;
  overflow: hidden;
  background: ${get('colors.propsBg')};
  color: ${get('colors.propsText')};
`

const Line = styled.div`
  padding: 8px 0;

  @media (min-width: ${breakpoint}) {
    padding: O;
  }

  & + & {
    border-top: 1px solid ${get('colors.border')};
  }
`

const Column = styled.div`
  min-width: 0;
  padding: 2px 15px;
  word-wrap: break-word;

  @media (min-width: ${breakpoint}) {
    padding: 8px 15px;
  }
`

const ColumnName = styled(Column)`
  @media (min-width: ${breakpoint}) {
    flex-basis: 25%;
  }
`

const ColumnType = styled(Column)`
  @media (min-width: ${breakpoint}) {
    flex-basis: 50%;
  }
`

const ColumnValue = styled(Column)`
  @media (min-width: ${breakpoint}) {
    flex-basis: 25%;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${get('fonts.mono')};

  @media (min-width: ${breakpoint}) {
    flex-wrap: nowrap;
    flex-direction: row;
  }
`

const PropName = styled.span`
  color: ${get('colors.primary')};
  font-weight: bold;
`

const PropType = styled.span`
  font-size: 0.9em;
`

const PropDefaultValue = styled.span`
  font-size: 0.9em;
`

const PropRequired = styled.span`
  font-size: 0.8em;
  opacity: 0.8;
`

export const PropsTable: React.SFC<PropsComponentProps> = ({
  props,
  getPropType,
}) => {
  const entries = Object.entries(props)
  const components = useComponents()
  const Paragraph = useMemo(
    () => styled(components.P || 'p')`
      margin: 0;
      font-size: 16px;
      color: ${get('colors.blockquoteColor')};
      padding: 0 15px 8px 15px;
    `,
    []
  )

  return (
    <Container>
      {entries.map(([key, prop]) => {
        if (!prop.type && !prop.flowType) return null
        return (
          <Line key={key}>
            <Content>
              <ColumnName>
                <PropName>{key}</PropName>
              </ColumnName>
              <ColumnType>
                <PropType>{getPropType(prop)}</PropType>
              </ColumnType>
              <ColumnValue>
                {prop.defaultValue && (
                  <PropDefaultValue>
                    {prop.defaultValue.value === "''" ? (
                      <em>= [Empty String]</em>
                    ) : (
                      <em>= {prop.defaultValue.value.replace(/\'/g, '"')}</em>
                    )}
                  </PropDefaultValue>
                )}
                {prop.required && (
                  <PropRequired>
                    <strong>required</strong>
                  </PropRequired>
                )}
              </ColumnValue>
            </Content>
            {prop.description && <Paragraph>{prop.description}</Paragraph>}
          </Line>
        )
      })}
    </Container>
  )
}
