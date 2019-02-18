import * as React from 'react'
import { SFC } from 'react'
import { useConfig } from 'docz'
import lighten from 'polished/lib/color/lighten'
import darken from 'polished/lib/color/darken'
import Maximize from 'react-feather/dist/icons/maximize'
import Minimize from 'react-feather/dist/icons/minimize'
import Refresh from 'react-feather/dist/icons/refresh-cw'
import Code from 'react-feather/dist/icons/code'
import styled, { css } from 'styled-components'

import { get as themeGet } from '@utils/theme'
import { CodeSandboxLogo } from './CodeSandboxLogo'
import { ActionButton, ClipboardAction } from '../Editor/elements'

interface ActionsProps {
  theme: any
  withRadius: boolean
}

const borderColor = themeGet('colors.border')
const getActionsBg = (p: ActionsProps) =>
  p.theme.docz.mode === 'light'
    ? lighten(0.13, borderColor(p))
    : darken(0.04, borderColor(p))

const Actions = styled.div<ActionsProps>`
  display: flex;
  justify-content: flex-end;
  padding: 0 5px;
  background: ${getActionsBg};
`

const actionStyle = css`
  padding: 3px 10px;
  border-left: 1px solid ${borderColor};
`

const Action = styled(ActionButton)<React.ButtonHTMLAttributes<any>>`
  ${actionStyle};
`

const Clipboard = styled(ClipboardAction)`
  ${actionStyle};
`

export interface ActionsBarProps {
  code: string
  showEditor: boolean
  fullscreen: boolean
  codesandboxUrl: string
  onClickRefresh: () => void
  onClickFullscreen: () => void
  onClickEditor: () => void
}

export const ActionsBar: SFC<ActionsBarProps> = ({
  showEditor,
  code,
  fullscreen,
  codesandboxUrl,
  onClickRefresh,
  onClickFullscreen,
  onClickEditor,
}) => {
  const config = useConfig()
  const hasSandbox = Boolean(config.codeSandbox)

  return (
    <Actions withRadius={showEditor}>
      <Action onClick={onClickRefresh} title="Refresh playground">
        <Refresh width={15} />
      </Action>
      {hasSandbox && (
        <Action
          as="a"
          href={codesandboxUrl}
          target="_blank"
          title="Open in CodeSandbox"
        >
          <CodeSandboxLogo style={{ height: '100%' }} width={15} />
        </Action>
      )}
      <Clipboard content={code} />
      <Action
        onClick={onClickFullscreen}
        title={fullscreen ? 'Minimize' : 'Maximize'}
      >
        {fullscreen ? <Minimize width={15} /> : <Maximize width={15} />}
      </Action>
      <Action
        onClick={onClickEditor}
        title={showEditor ? 'Close editor' : 'Show editor'}
      >
        <Code width={15} />
      </Action>
    </Actions>
  )
}
