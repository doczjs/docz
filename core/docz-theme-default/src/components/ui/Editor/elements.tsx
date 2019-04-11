import * as React from 'react'
import { SFC } from 'react'
import BaseCheck from 'react-feather/dist/icons/check'
import Clipboard from 'react-feather/dist/icons/clipboard'
import Code from 'react-feather/dist/icons/code'
import rgba from 'polished/lib/color/rgba'
import copy from 'copy-text-to-clipboard'
import styled from 'styled-components'

import { ButtonSwap } from './ButtonSwap'
import { get } from '@utils/theme'

const textColor = get('colors.text', '#2D3747')

export const ActionButton = styled(ButtonSwap)`
  padding: 4px;
  background: transparent;
  font-size: 12px;
  text-transform: uppercase;
  transition: color 0.3s;

  &,
  & a {
    color: ${p => rgba(textColor(p), 0.4)};
  }

  &:hover,
  & a:hover {
    color: ${p => rgba(textColor(p), 0.7)};
  }
`

export const RunKitTextLogo = styled.span`
  font-family: 'Fira Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 0 2px;
`

const Check = styled(BaseCheck)`
  stroke: ${get('colors.primary')};
`

interface ClipboardActionProps {
  content: string
}

interface PanelSwitchActionProps {
  action: (...args: any[]) => void
}

export const ClipboardAction: SFC<ClipboardActionProps> = ({
  content,
  ...props
}) => (
  <ActionButton
    {...props}
    title="Copy to clipboard"
    onClick={() => copy(content)}
    swap={<Check width={17} />}
  >
    <Clipboard width={15} />
  </ActionButton>
)

export const RunKitAction: SFC<PanelSwitchActionProps> = ({
  action,
  ...props
}) => (
  <ActionButton
    {...props}
    title="Open in RunKit"
    onClick={action}
    swap={<Check width={17} />}
  >
    <Code width={15} />
    <RunKitTextLogo> RunKit</RunKitTextLogo>
  </ActionButton>
)
