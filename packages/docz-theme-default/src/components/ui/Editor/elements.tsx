import { SFC } from 'react'
import BaseCheck from 'react-feather/dist/icons/check'
import Clipboard from 'react-feather/dist/icons/clipboard'
import rgba from 'polished/lib/color/rgba'
import copy from 'copy-text-to-clipboard'
import styled from '@emotion/styled'
import { jsx } from '@emotion/core'

import { ButtonSwap } from '../ButtonSwap'
import { ButtonLink } from '../Button'
import { get } from '@utils/theme'

const textColor = get('colors.text')
export const ActionButton = styled(ButtonSwap)`
  padding: 4px;
  background: transparent;
  font-size: 12px;
  text-transform: uppercase;
  color: ${p => rgba(textColor(p), 0.4)};
  transition: color 0.3s;

  &:hover {
    color: ${p => rgba(textColor(p), 0.7)};
  }
`

interface WidthProps {
  width: number
}

const Check = styled(BaseCheck)<WidthProps>`
  stroke: ${get('colors.primary')};
`

interface ClipboardActionProps {
  content: string
}

export const ClipboardAction: SFC<ClipboardActionProps> = ({
  content,
  ...props
}) => (
  <ActionButton
    {...props}
    as={ButtonLink as any}
    title="Copy to clipboard"
    onClick={() => copy(content)}
    swap={<Check width={17} />}
  >
    <Clipboard width={15} />
  </ActionButton>
)
