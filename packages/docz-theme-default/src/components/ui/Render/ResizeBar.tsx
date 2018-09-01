import * as React from 'react'
import { SFC } from 'react'
import Smartphone from 'react-feather/dist/icons/smartphone'
import Tablet from 'react-feather/dist/icons/tablet'
import Monitor from 'react-feather/dist/icons/monitor'
import styled from 'react-emotion'

import { ActionButton } from '../Editor'

const Wrapper = styled('div')`
  position: absolute;
  top: 10px;
  left: 50%;
  margin-bottom: 5px;
  transform: translateX(-50%);
`

const Buttons = styled('div')`
  display: flex;
  background: ${p => p.theme.docz.colors.background};
  border: 1px solid ${p => p.theme.docz.colors.border};
  border-radius: 3px;
  padding: 3px 5px;
`

export interface ResizeProps {
  onChangeSize: (width: string, height: string) => void
}

export const ResizeBar: SFC<ResizeProps> = ({ onChangeSize }) => (
  <Wrapper>
    <Buttons>
      <ActionButton
        onClick={() => onChangeSize('360px', '640px')}
        title="Smartphone"
      >
        <Smartphone width={20} />
      </ActionButton>
      <ActionButton
        onClick={() => onChangeSize('768px', '1024px')}
        title="Tablet"
      >
        <Tablet width={20} />
      </ActionButton>
      <ActionButton
        onClick={() => onChangeSize('1366px', '1024px')}
        title="Monitor"
      >
        <Monitor width={20} />
      </ActionButton>
    </Buttons>
  </Wrapper>
)
