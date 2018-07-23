import * as React from 'react'
import { Component, Fragment } from 'react'
import { RenderComponentProps } from 'docz'
import Maximize from 'react-feather/dist/icons/maximize'
import Minimize from 'react-feather/dist/icons/minimize'
import Resizable from 're-resizable'
import hotkeys from 'hotkeys-js'
import styled from 'react-emotion'

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

const storage = localStorage()
const get = (pos: number): any => storage.get(pos.toString())
const remove = (pos: number): void => storage.remove(pos.toString())
const set = (pos: number, size: string): void =>
  storage.set(pos.toString(), size)

const parseSize = (position: number) => (key: string) => {
  const obj = JSON.parse(get(position))
  return obj ? obj[key] : '100%'
}

export interface RenderState {
  fullscreen: boolean
  width: string
  height: string
}

export class Render extends Component<RenderComponentProps, RenderState> {
  public state: RenderState = {
    fullscreen: Boolean(get(this.props.position)),
    width: parseSize(this.props.position)('width'),
    height: parseSize(this.props.position)('height'),
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
    const { rawCode } = this.props
    const { fullscreen } = this.state

    return (
      <Fragment>
        <ActionButton
          onClick={this.handleToggle}
          title={fullscreen ? 'Minimize' : 'Maximize'}
        >
          {fullscreen ? <Minimize width={15} /> : <Maximize width={15} />}
        </ActionButton>
        <ClipboardAction content={rawCode} />
      </Fragment>
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
    const { className, style, component, rawCode } = this.props
    const { fullscreen } = this.state

    return (
      <Overlay full={fullscreen}>
        {fullscreen && <ResizeBar onChangeSize={this.handleSetSize} />}
        <Resizable {...this.resizableProps}>
          <Wrapper full={fullscreen}>
            <Playground className={className} style={style}>
              {component}
            </Playground>
            <Pre actions={this.actions}>{rawCode}</Pre>
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

  private isFullscreen = (position: number) => Boolean(get(position))

  private setSize = () => {
    const { fullscreen, ...state } = this.state
    set(this.props.position, JSON.stringify(state))
  }

  private handleToggle = () => {
    const { position } = this.props
    const { fullscreen } = this.state

    if (fullscreen) remove(position)
    else this.setSize()

    const isFull = this.isFullscreen(position)
    const parse = parseSize(position)
    const width = parse('width')
    const height = parse('height')

    this.setState({
      fullscreen: isFull,
      width,
      height,
    })
  }

  private closeOnEsc = () => {
    this.state.fullscreen && this.handleToggle()
  }

  private handleSetSize = (width: string, height: string) => {
    this.setState({ width, height }, () => this.setSize())
  }
}
