import * as React from 'react'
import { Fragment } from 'react'
import { RenderComponent } from 'docz'
import { Toggle } from 'react-powerplug'
import lighten from 'polished/lib/color/lighten'
import darken from 'polished/lib/color/darken'
import Maximize from 'react-feather/dist/icons/maximize'
import Minimize from 'react-feather/dist/icons/minimize'
import Resizable from 're-resizable'
import Hotkeys from 'react-hot-keys'
import styled, { css } from 'react-emotion'

import { Pre as PreBase, ActionButton, ClipboardAction } from './Pre'

const HANDLE_WIDTH = 20

interface WrapperProps {
  full: boolean
}

const whenFull = (on: any, off: any) => (p: WrapperProps) => (p.full ? on : off)

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  z-index: ${whenFull(99999, 0)};
  position: ${whenFull('fixed', 'initial')};
  top: 0;
  left: 0;
  padding: ${whenFull('20px', '0')};
  margin: 0 0 30px;
  height: ${whenFull('100vh', '100%')};
  width: ${whenFull('100vw', `calc(100% - ${HANDLE_WIDTH - 10}px)`)};
  background: ${whenFull('rgba(0,0,0,0.5)', 'transparent')};
`

const Playground = styled('div')`
  flex: 1;
  background: ${p => p.theme.colors.background};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 4px 4px 0 0;
  ${p => p.theme.mq(p.theme.styles.playground)};
`

const Pre = styled(PreBase)`
  margin: 0;
  border-radius: 0 0 4px 4px;
  border-top: 0;
`

const line = (color: string, left: string) => css`
  position: absolute;
  display: block;
  top: 50%;
  left: ${left};
  content: '';
  width: 2px;
  height: 25px;
  background: ${color};
  transform: translate(-50%, -50%);
`

const Handle = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: ${HANDLE_WIDTH}px;
  height: 100%;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 0 4px 4px 0;
  background: ${p =>
    p.theme.mode === 'light'
      ? lighten(0.1, p.theme.colors.border)
      : darken(0.1, p.theme.colors.border)};

  &:after {
    ${p => line(p.theme.colors.border, 'calc(50% + 3px)')};
  }

  &:before {
    ${p => line(p.theme.colors.border, 'calc(50% - 3px)')};
  }
`

export const Render: RenderComponent = ({
  className,
  style,
  component,
  rawCode,
}) => (
  <Toggle>
    {({ on, toggle }: any) => {
      const actions = (
        <Fragment>
          <ActionButton onClick={toggle} title={on ? 'Minimize' : 'Maximize'}>
            {on ? <Minimize width={15} /> : <Maximize width={15} />}
          </ActionButton>
          <ClipboardAction content={rawCode} />
        </Fragment>
      )

      const resizableEnable = {
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }

      return (
        <Resizable
          minWidth={320}
          maxWidth="100%"
          enable={resizableEnable}
          handleComponent={{ right: Handle }}
        >
          <Hotkeys keyName="esc" onKeyUp={() => on && toggle()}>
            <Wrapper full={on}>
              <Playground className={className} style={style}>
                {component}
              </Playground>
              <Pre actions={actions}>{rawCode}</Pre>
              {/* {!on && <Handle />} */}
            </Wrapper>
          </Hotkeys>
        </Resizable>
      )
    }}
  </Toggle>
)
