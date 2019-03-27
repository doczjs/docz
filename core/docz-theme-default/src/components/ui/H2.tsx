import * as React from 'react'
import { SFC } from 'react'
import styled from 'styled-components'
import Hash from 'react-feather/dist/icons/hash'

import { get } from '@utils/theme'

const Icon = styled(Hash)`
  position: absolute;
  display: inline-block;
  top: 11px;
  left: -28px;
  opacity: 0;
  transition: opacity 0.2s;
  color: ${get('colors.primary')};
`

const Heading = styled.h2`
  position: relative;

  &:hover .heading--Icon {
    opacity: 1;
  }

  ${get('styles.h2')};
`

export const H2: SFC<React.HTMLAttributes<any>> = ({ children, ...props }) => {
  const pathname = typeof window !== 'undefined' ? location.pathname : '/'
  return (
    <Heading {...props}>
      <a aria-hidden href={`${pathname}#${props.id}`}>
        <Icon className="heading--Icon" height={20} />
      </a>
      {children}
    </Heading>
  )
}
