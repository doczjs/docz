import * as React from 'react'
import { Component } from 'react'
import { ThemeConfig } from 'docz'
import styled from 'react-emotion'
import getter from 'lodash.get'

import { CodeMirror } from '../CodeMirror'
import { ClipboardAction } from './elements'
import { get } from '@utils/theme'

const getLanguage = (children: any) => {
  const defaultLanguage = 'jsx'
  if (typeof children === 'string') return defaultLanguage

  const language = getter(children, 'props.props.className') || defaultLanguage
  const result = language.replace('language-', '')

  if (result === 'js' || result === 'javascript') return 'jsx'
  if (result === 'ts' || result === 'tsx' || result === 'typescript') {
    return 'text/typescript'
  }
  return result
}

const getChildren = (children: any) =>
  children && typeof children !== 'string'
    ? getter(children, 'props.children')
    : children

const Wrapper = styled('div')`
  margin: 30px 0;
  position: relative;
  width: 100%;
  border: 1px solid ${get('colors.border')};
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

export interface EditorProps {
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
      editorDidMount: this.onEditorDidMount,
      onBeforeChange: this.handleChange,
      options: {
        ...options,
        theme:
          config && config.themeConfig
            ? config.themeConfig.codemirrorTheme
            : options.theme,
      },
    })

    return (
      <Wrapper className={className}>
        <ThemeConfig>
          {config => <CodeMirror {...editorProps(config)} />}
        </ThemeConfig>
        <Actions>{actions || <ClipboardAction content={code} />}</Actions>
      </Wrapper>
    )
  }

  private onEditorDidMount = (editor: any) => {
    if (editor) {
      this.removeLastLine(editor)
      editor.refresh()
    }
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
