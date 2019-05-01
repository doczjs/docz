import * as React from 'react'
import { useMemo } from 'react'
import { PropsComponentProps, useComponents } from 'docz'
import styled from 'styled-components'

import { get } from '~utils/theme'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  & ~ & {
    margin-top: 20px;
  }
`

const Title = styled.div`
  display: flex;
  border-bottom: 1px solid ${get('colors.propsBg')};
`

const PropName = styled.span`
  background: ${get('colors.propsBg')};
  color: ${get('colors.primary')};
  padding: 5px 10px;
  border-radius: 4px 4px 0 0;
  font-size: 16px;
  font-weight: 500;

  & ~ & {
    margin-left: 5px;
  }
`

const PropType = styled(PropName)`
  color: ${get('colors.propsText')};
  background: ${get('colors.propsBg')};
  font-weight: 400;
`

const PropDefaultValue = styled(PropType)`
  background: transparent;
  padding-left: 0;
  padding-right: 0;
`

const PropRequired = styled(PropType)`
  flex: 1;
  text-align: right;
  background: transparent;
  opacity: 0.5;
`

export const PropsRaw: React.SFC<PropsComponentProps> = ({
  props,
  getPropType,
}) => {
  const entries = Object.entries(props)
  const components = useComponents()
  const Paragraph = useMemo(
    () => styled(components.P || 'p')`
      font-size: 16px;
      color: ${get('colors.sidebarText')};
    `,
    []
  )

  return (
    <React.Fragment>
      {entries.map(([key, prop]) => {
        if (!prop.type && !prop.flowType) return null
        return (
          <Wrapper key={key}>
            <Title>
              <PropName>{key}</PropName>
              <PropType>{getPropType(prop)}</PropType>
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
                  <em>required</em>
                </PropRequired>
              )}
            </Title>
            {prop.description && <Paragraph>{prop.description}</Paragraph>}
          </Wrapper>
        )
      })}
    </React.Fragment>
  )
}
