import * as React from 'react'
import { useState, useMemo } from 'react'
import { PropsComponentProps, useComponents } from 'docz'
import styled from 'styled-components'
import { PropsRaw } from './PropsRaw'
import { PropsTable } from './PropsTable'

const Container = styled.div`
  margin: 20px 0;
`

export const Props: React.SFC<PropsComponentProps> = ({
  title,
  isRaw,
  isToggle,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const components = useComponents()
  const Title = useMemo(
    () => styled(components.H3 || 'h3')`
      padding: 8px 0;
      position: relative;
      ${!isRaw ? 'margin-bottom: 0;' : ''}
      ${!isOpen || isRaw
        ? 'border-bottom: 1px solid rgba(0, 0, 0, 0.1);'
      : ''}

      ${isToggle ? `
        cursor: pointer;
        padding-right: 40px;

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%) ${isOpen ? 'rotate(-135deg)' : 'rotate(45deg)'};
          ${!isOpen ? 'margin-top: -2px;' : ''}
          width: 8px;
          height: 8px;
          border-bottom: 2px solid;
          border-right: 2px solid;
        }
      `: ''}
    `,
    [isOpen]
  )

  const titleProps = isToggle ? {
    onClick: () => setIsOpen(open => !open),
    onkeydown: () => setIsOpen(open => !open),
    role: 'button',
    tabindex: 0,
  } : {}

  return (
    <Container>
      {(!!title || isToggle) && (
        <Title {...titleProps}>
          {title || 'Component props'}
        </Title>
      )}
      {isOpen && (
        <div>
          {isRaw ? (
            <PropsRaw {...props} />
          ): (
            <PropsTable {...props} />
          )}
        </div>
      )}
    </Container>
  )
}
