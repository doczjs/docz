import * as React from 'react'
import { SFC, Component } from 'react'
import { ThemeConfig } from 'docz'
import styled from 'react-emotion'
import rgba from 'polished/lib/color/rgba'
import BaseCheck from 'react-feather/dist/icons/check'
import Clipboard from 'react-feather/dist/icons/clipboard'
import { Controlled as CodeMirror } from 'react-codemirror2'
import PerfectScrollbar from 'react-perfect-scrollbar'
import copy from 'copy-text-to-clipboard'
import get from 'lodash.get'

import { ButtonSwap } from '../ButtonSwap'
import { ButtonLink } from '../Button'
import * as themes from '../../../styles/codemirror'

import './ps-scrollbar'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/css/css'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/fold/xml-fold'

const getLanguage = (children: any) => {
  const defaultLanguage = 'jsx'
  if (typeof children === 'string') return defaultLanguage
  const language = get(children, 'props.props.className') || defaultLanguage
  const result = language.replace('language-', '')
  return result === 'js' || result === 'javascript' ? 'jsx' : result
}

const getChildren = (children: any) =>
  children && typeof children !== 'string'
    ? get(children, 'props.children')
    : children

const Wrapper = styled('div')`
  margin: 30px 0;
  position: relative;
  width: 100%;
  border: 1px solid ${p => p.theme.docz.colors.border};
  border-radius: 3px;
`

const Scrollbar = styled(PerfectScrollbar)`
  overflow: auto;
  position: relative;
  max-height: 360px;

  .ps__rail-y {
    z-index: 9;
    opacity: 0.4;
  }
`

const EditorStyled = styled(CodeMirror)`
  ${themes.dark()};
  ${themes.light()};
  ${p => p.theme.docz.mq(p.theme.docz.styles.pre)};
  position: relative;
  border-radius: 3px;
  flex: 1;

  .CodeMirror {
    max-width: 100%;
    height: 100%;
  }

  .CodeMirror pre {
    ${p => p.theme.docz.mq(p.theme.docz.styles.pre)};
  }

  .CodeMirror-gutters {
    left: 1px !important;
  }

  .CodeMirror-lines {
    padding: 10px 0;
  }

  .CodeMirror-line {
    padding: 0 10px;
  }

  .CodeMirror-linenumber {
    padding: 0 7px 0 5px;
  }
`

const Actions = styled('div')`
  z-index: 999;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 10px;
  background: transparent;
`

export const ActionButton = styled(ButtonSwap)`
  padding: 4px;
  background: transparent;
  font-size: 12px;
  text-transform: uppercase;
  color: ${p => rgba(p.theme.docz.colors.text, 0.4)};
  transition: color 0.3s;

  &:hover {
    color: ${p => rgba(p.theme.docz.colors.text, 0.7)};
  }
`

const Check = styled(BaseCheck)`
  stroke: ${p => p.theme.docz.colors.primary};
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

interface EditorProps {
  children: any
  className?: string
  editorClassName?: string
  actions?: React.ReactNode
  readOnly?: boolean
  mode?: string
  matchBrackets?: boolean
  indentUnit?: number
  onChange?: (code: string) => any
  language?: string
  withLastLine?: boolean
}

interface EditorState {
  code: string
}

export class Editor extends Component<EditorProps, EditorState> {
  public static defaultProps = {
    mode: 'js',
    readOnly: true,
    matchBrackets: true,
    indentUnit: 2,
  }

  public state = {
    code: getChildren(this.props.children),
  }

  public render(): React.ReactNode {
    const { code } = this.state
    const {
      mode,
      children,
      actions,
      onChange,
      className,
      editorClassName,
      language: defaultLanguage,
      ...props
    } = this.props

    const language = defaultLanguage || getLanguage(children)
    const options = {
      ...props,
      tabSize: 2,
      mode: language || mode,
      lineNumbers: true,
      lineWrapping: true,
      autoCloseTags: true,
      theme: 'docz-light',
    }

    const editorProps = (config: any) => ({
      value: this.state.code,
      className: editorClassName,
      editorDidMount: this.removeLastLine,
      onBeforeChange: this.handleChange,
      options: {
        ...options,
        theme:
          config && config.themeConfig
            ? config.themeConfig.codemirrorTheme
            : options.theme,
      },
    })

    const scrollbarOpts = {
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20,
      suppressScrollX: true,
    }

    return (
      <Wrapper className={className}>
        <ThemeConfig>
          {config => (
            <Scrollbar option={scrollbarOpts}>
              <EditorStyled {...editorProps(config)} />
            </Scrollbar>
          )}
        </ThemeConfig>
        <Actions>{actions || <ClipboardAction content={code} />}</Actions>
      </Wrapper>
    )
  }

  private removeLastLine = (editor: any) => {
    if (editor && !this.props.withLastLine && this.props.readOnly) {
      const lastLine = editor.lastLine()
      editor.doc.replaceRange('', { line: lastLine - 1 }, { line: lastLine })
    }
  }

  private handleChange = (editor: any, data: any, code: string) => {
    this.props.onChange && this.props.onChange(code)
    this.setState({ code })
  }
}
