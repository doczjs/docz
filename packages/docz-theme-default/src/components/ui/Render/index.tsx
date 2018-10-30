import * as React from 'react'
import { SFC, Fragment, Component } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { RenderComponentProps, ThemeConfig } from 'docz'
import { LiveProvider, LiveError, LivePreview } from 'react-live'
import styled, { css } from 'react-emotion'
import lighten from 'polished/lib/color/lighten'
import darken from 'polished/lib/color/darken'
import rgba from 'polished/lib/color/rgba'
import Resizable from 're-resizable'
import Maximize from 'react-feather/dist/icons/maximize'
import Minimize from 'react-feather/dist/icons/minimize'
import Refresh from 'react-feather/dist/icons/refresh-cw'
import hotkeys from 'hotkeys-js'
import getter from 'lodash.get'
import pretty from 'pretty'

import { Handle, HANDLE_SIZE } from './Handle'
import { ResizeBar } from './ResizeBar'
import { LiveConsumer } from './LiveConsumer'
import { CodeSandboxLogo } from './CodeSandboxLogo'
import { ActionButton, ClipboardAction, Editor as PreBase } from '../Editor'

import { localStorage } from '@utils/local-storage'
import { get as themeGet } from '@utils/theme'

interface OverlayProps {
  full: boolean
}

const whenFullscreen = (on: any, off: any) => (p: OverlayProps) =>
  p.full ? on : off

const Overlay = styled('div')`
  z-index: ${whenFullscreen(9999, 0)};
  position: ${whenFullscreen('fixed', 'relative')};
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
const borderColor = themeGet('colors.border')
const backgroundColor = themeGet('colors.background')
const textColor = themeGet('colors.text')

const PlaygroundWrapper = styled('div')`
  overflow-y: auto;
  position: relative;
  flex: 1;
  border-radius: 4px 4px 0 0;
  border: 1px solid ${borderColor};
  background: ${backgroundColor};
  min-height: ${whenFullscreen('198px', 'auto')};
  ${p => p.theme.docz.mq(p.theme.docz.styles.playground)};
`

const StyledPreview = styled(LivePreview)`
  width: 100%;
`

const DummyPlayground = styled('div')`
  width: 100%;
`

const StyledError = styled(LiveError)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: ${rgba('black', 0.8)};
  font-size: 16px;
  color: white;
`

const Pre = styled(PreBase)`
  width: calc(100% - 4px);
  margin: 0;
`

const editorClassName = css`
  border-top: 0;
  border-radius: 0 0 0 5px;
`

const Actions = styled('div')`
  display: flex;
  padding: 0 5px;
  background: ${p =>
    p.theme.docz.mode === 'light'
      ? lighten(0.13, borderColor(p))
      : darken(0.04, borderColor(p))};
  border-left: 1px solid ${themeGet('colors.border')};
  border-bottom: 1px solid ${themeGet('colors.border')};
`

const actionClass = (p: any) => css`
  padding: 3px 10px;
  border-left: 1px solid ${borderColor(p)};
`

const Action = styled(ActionButton)`
  ${actionClass};
`

const ActionLink = Action.withComponent('a')

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
  color: ${(p: TabProps) => rgba(textColor(p), p.active ? 0.8 : 0.4)};
  transition: color 0.3s;
`

const storage = localStorage()
const get = (pos: number): any => storage.get(pos.toString())
const remove = (pos: number): void => storage.remove(pos.toString())
const set = (pos: number, size: string): void =>
  storage.set(pos.toString(), size)

const parse = (position: number, key: string, defaultValue: any) => {
  const obj = JSON.parse(get(position))
  return obj ? getter(obj, key) : defaultValue
}

interface JSXProps {
  onChange: (code: string) => any
}

const Jsx: SFC<JSXProps> = ({ children, ...props }) => (
  <Pre
    {...props}
    readOnly={false}
    className={editorClassName}
    actions={<Fragment />}
  >
    {children}
  </Pre>
)

export interface RenderState {
  fullscreen: boolean
  width: string
  height: string
  showing: 'jsx' | 'html'
  code: string
  key: number
}

export class Render extends Component<RenderComponentProps, RenderState> {
  public state: RenderState = {
    fullscreen: parse(this.props.position, 'fullscreen', false),
    width: parse(this.props.position, 'width', '100%'),
    height: parse(this.props.position, 'height', '100%'),
    showing: parse(this.props.position, 'showing', 'jsx'),
    code: this.props.code,
    key: 0,
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
    const { showing, fullscreen } = this.state
    const { codesandbox } = this.props

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
        <Action onClick={this.handleRefresh} title="Refresh playground">
          <Refresh width={15} />
        </Action>
        {codesandbox !== 'undefined' && (
          <ThemeConfig>
            {config => (
              <ActionLink
                href={this.codesandboxUrl(config.native)}
                target="_blank"
                title="Open in CodeSandbox"
              >
                <CodeSandboxLogo style={{ height: '100%' }} width={15} />
              </ActionLink>
            )}
          </ThemeConfig>
        )}
        <Clipboard content={showing === 'jsx' ? this.state.code : this.html} />
        <Action
          onClick={this.handleToggle}
          title={fullscreen ? 'Minimize' : 'Maximize'}
        >
          {fullscreen ? <Minimize width={15} /> : <Maximize width={15} />}
        </Action>
      </Actions>
    )
  }

  get html(): string {
    return pretty(renderToStaticMarkup(this.props.component))
  }

  get resizableProps(): Record<string, any> {
    const { fullscreen, width, height } = this.state

    return {
      minHeight: fullscreen ? 360 : '100%',
      minWidth: 260,
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
    const { className, style, scope } = this.props
    const { fullscreen, showing, key } = this.state

    return (
      <LiveProvider
        noInline
        code={this.state.code}
        scope={scope}
        transformCode={this.transformCode}
        mountStylesheet={false}
      >
        <Overlay full={fullscreen}>
          {fullscreen ? <ResizeBar onChangeSize={this.handleSetSize} /> : null}
          <Resizable {...this.resizableProps}>
            <Wrapper full={fullscreen}>
              <LiveConsumer key={key}>
                {(live: any) => (
                  <PlaygroundWrapper full={fullscreen}>
                    {live.error && (
                      <DummyPlayground className={className} style={style}>
                        {this.props.component}
                      </DummyPlayground>
                    )}
                    <StyledPreview className={className} style={style} />
                    <StyledError />
                  </PlaygroundWrapper>
                )}
              </LiveConsumer>
              {this.actions}
              {showing === 'jsx' ? (
                <Jsx onChange={code => this.setState({ code })}>
                  {this.state.code}
                </Jsx>
              ) : (
                <Pre
                  className={editorClassName}
                  actions={<Fragment />}
                  withLastLine
                >
                  {this.html}
                </Pre>
              )}
            </Wrapper>
          </Resizable>
        </Overlay>
      </LiveProvider>
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

  private handleRefresh = () => {
    this.setState(state => ({ key: state.key + 1 }))
  }

  private transformCode(code: string): string {
    return `
      const DoczApp = ({ children }) => (
        <React.Fragment>
          {children && typeof children === 'function' ? children() : children}
        </React.Fragment>
      )

      render(<DoczApp>${code}</DoczApp>)
    `
  }

  private codesandboxUrl = (native: boolean): string => {
    const { codesandbox } = this.props
    const url = 'https://codesandbox.io/api/v1/sandboxes/define'

    return `${url}?parameters=${codesandbox}${native ? `&editorsize=75` : ``}`
  }
}
