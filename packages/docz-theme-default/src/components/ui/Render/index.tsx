import * as React from 'react'
import { Component, Fragment } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { RenderComponentProps } from 'docz'
import styled, { css } from 'react-emotion'
import lighten from 'polished/lib/color/lighten'
import darken from 'polished/lib/color/darken'
import rgba from 'polished/lib/color/rgba'
import Resizable from 're-resizable'
import Maximize from 'react-feather/dist/icons/maximize'
import Minimize from 'react-feather/dist/icons/minimize'
import hotkeys from 'hotkeys-js'
import getIn from 'lodash.get'
import pretty from 'pretty'

import { ResizeBar } from './ResizeBar'
import { Handle, HANDLE_SIZE } from './Handle'
import { Pre as PreBase, ActionButton, ClipboardAction } from '../Pre'
import { localStorage } from '../../../utils/local-storage'

interface OverlayProps {
  full: boolean
}

const whenFullscreen = (on: any, off: any) => (p: OverlayProps) =>
  p.full ? on : off

const Overlay = styled('div')`
  z-index: ${whenFullscreen(9999, 0)};
  position: ${whenFullscreen('fixed', 'initial')};
  top: 0;
  left: 0;
  width: ${whenFullscreen('100vw', 'auto')};
  height: ${whenFullscreen('100vh', 'auto')};
  padding: ${whenFullscreen('60px 20px 20px', '0px')};
  margin: ${whenFullscreen('0px', '0 0 30px')};
  background: ${whenFullscreen('rgba(0,0,0,0.5)', 'transparent')};
  transition: background 0.3s;
`

const minusHandleSize = `calc(100% - ${HANDLE_SIZE} + 10px)`
const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: ${whenFullscreen(minusHandleSize, '100%')};
  width: ${minusHandleSize};
`

const Playground = styled('div')`
  overflow-y: hidden;
  flex: 1;
  background: ${p => p.theme.docz.colors.background};
  border: 1px solid ${p => p.theme.docz.colors.border};
  border-radius: 4px 4px 0 0;
  ${p => p.theme.docz.mq(p.theme.docz.styles.playground)};
`

const Pre = styled(PreBase)`
  margin: 0;
  border-radius: 0 0 4px 4px;
  border-top: 0;
`

const Actions = styled('div')`
  display: flex;
  padding: 0 5px;
  background: ${p =>
    p.theme.docz.mode === 'light'
      ? lighten(0.13, p.theme.docz.colors.border)
      : darken(0.04, p.theme.docz.colors.border)};
  border-left: 1px solid ${p => p.theme.docz.colors.border};
  border-bottom: 1px solid ${p => p.theme.docz.colors.border};
`

const actionClass = (p: any) => css`
  padding: 3px 10px;
  border-left: 1px solid ${p.theme.docz.colors.border};
`

const Action = styled(ActionButton)`
  ${actionClass};
`

const Clipboard = styled(ClipboardAction)`
  ${actionClass};
`

const Tabs = styled('div')`
  flex: 1;
  display: flex;
  align-items: center;
`

interface TabProps {
  active: boolean
  theme?: any
}

const Tab = styled('button')`
  position: relative;
  cursor: pointer;
  display: block;
  outline: none;
  height: 100%;
  background: none;
  border: none;
  font-size: 14px;
  color: ${(p: TabProps) =>
    rgba(p.theme.docz.colors.text, p.active ? 0.8 : 0.4)};
  transition: color 0.3s;
`

const storage = localStorage()
const get = (pos: number): any => storage.get(pos.toString())
const remove = (pos: number): void => storage.remove(pos.toString())
const set = (pos: number, size: string): void =>
  storage.set(pos.toString(), size)

const parse = (position: number, key: string, defaultValue: any) => {
  const obj = JSON.parse(get(position))
  return obj ? getIn(obj, key) : defaultValue
}

export interface RenderState {
  fullscreen: boolean
  width: string
  height: string
  showing: 'jsx' | 'html'
}

export class Render extends Component<RenderComponentProps, RenderState> {
  public state: RenderState = {
    fullscreen: parse(this.props.position, 'fullscreen', false),
    width: parse(this.props.position, 'width', '100%'),
    height: parse(this.props.position, 'height', '100%'),
    showing: parse(this.props.position, 'showing', 'jsx'),
  }

  public componentDidMount(): void {
    this.addUnloadListener()
    hotkeys('esc', this.closeOnEsc)
  }

  public componentWillUnmount(): void {
    this.removeUnloadListener()
    hotkeys.unbind('esc')
  }

  get actions(): JSX.Element {
    const { code } = this.props
    const { showing, fullscreen } = this.state

    const showJsx = this.handleShow('jsx')
    const showHtml = this.handleShow('html')

    return (
      <Actions>
        <Tabs>
          <Tab active={showing === 'jsx'} onClick={showJsx}>
            JSX
          </Tab>
          <Tab active={showing === 'html'} onClick={showHtml}>
            HTML
          </Tab>
        </Tabs>
        <Clipboard content={code} />
        <Action
          onClick={this.handleToggle}
          title={fullscreen ? 'Minimize' : 'Maximize'}
        >
          {fullscreen ? <Minimize width={15} /> : <Maximize width={15} />}
        </Action>
      </Actions>
    )
  }

  get resizableProps(): Record<string, any> {
    const { fullscreen, width, height } = this.state

    return {
      minHeight: fullscreen ? 360 : '100%',
      minWidth: 320,
      maxWidth: '100%',
      maxHeight: '100%',
      size: {
        width,
        height,
      },
      style: {
        margin: '0 auto ',
      },
      enable: {
        top: false,
        right: true,
        bottom: fullscreen,
        left: false,
        topRight: false,
        bottomRight: fullscreen,
        bottomLeft: false,
        topLeft: false,
      },
      handleComponent: {
        right: () => <Handle full={fullscreen} horizontal />,
        bottom: () => <Handle full={fullscreen} horizontal={false} />,
      },
      onResizeStop: (e: any, direction: any, ref: any, d: any) => {
        const width = ref.style.width
        const height = ref.style.height

        this.handleSetSize(width, height)
      },
    }
  }

  public render(): JSX.Element {
    const { className, style, component, code } = this.props
    const { showing, fullscreen } = this.state

    return (
      <Overlay full={fullscreen}>
        {fullscreen && <ResizeBar onChangeSize={this.handleSetSize} />}
        <Resizable {...this.resizableProps}>
          <Wrapper full={fullscreen}>
            <Playground className={className} style={style}>
              {component}
            </Playground>
            {this.actions}
            <Pre actions={<Fragment />}>
              {showing === 'jsx'
                ? code
                : pretty(renderToStaticMarkup(component))}
            </Pre>
          </Wrapper>
        </Resizable>
      </Overlay>
    )
  }

  private unloadListener = (): void => remove(this.props.position)

  private addUnloadListener = () => {
    if (window && typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.unloadListener, false)
    }
  }

  private removeUnloadListener = () => {
    if (window && typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.unloadListener, false)
    }
  }

  private setSize = (fullscreen: boolean) => {
    set(this.props.position, JSON.stringify({ ...this.state, fullscreen }))
  }

  private handleToggle = () => {
    const { position } = this.props
    const { fullscreen } = this.state

    if (fullscreen) remove(position)
    else this.setSize(true)

    this.setState({
      fullscreen: parse(position, 'fullscreen', false),
      width: parse(position, 'width', '100%'),
      height: parse(position, 'height', '100%'),
    })
  }

  private handleShow = (showing: 'jsx' | 'html') => () => {
    this.setState({ showing })
  }

  private closeOnEsc = () => {
    this.state.fullscreen && this.handleToggle()
  }

  private handleSetSize = (width: string, height: string) => {
    const fullscreen = parse(this.props.position, 'fullscreen', false)
    this.setState({ width, height }, () => this.setSize(fullscreen))
  }
}
