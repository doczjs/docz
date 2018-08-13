import * as React from 'react'
import { SFC, Component } from 'react'
import { ThemeConfig } from 'docz'
import styled from 'react-emotion'
import rgba from 'polished/lib/color/rgba'
import BaseCheck from 'react-feather/dist/icons/check'
import Clipboard from 'react-feather/dist/icons/clipboard'
import Codemirror from 'react-codemirror'
import copy from 'copy-text-to-clipboard'
import get from 'lodash.get'

import { ButtonSwap } from './ButtonSwap'
import { ButtonLink } from './Button'
import * as themes from '../../styles/codemirror'

import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/css/css'
import 'codemirror/addon/edit/matchbrackets'

const getLanguage = (children: any) => {
  const defaultLanguage = 'jsx'
  if (typeof children === 'string') return defaultLanguage
  const language = get(children, 'props.props.className') || defaultLanguage
  const result = language.replace('language-', '')
  return result === 'js' || result === 'javascript' ? 'jsx' : result
}

const getChildren = (children: any) =>
  children && typeof children !== 'string' ? children.props.children : children

const Wrapper = styled('div')`
  margin: 30px 0;
  position: relative;
  overflow-y: auto;
`

const Editor = styled(Codemirror)`
  ${themes.dark()};
  ${themes.light()};
  ${p => p.theme.docz.mq(p.theme.docz.styles.pre)};
  position: relative;
  border-radius: 5px;
  border: 1px solid ${p => p.theme.docz.colors.border};
  overflow-y: auto;
  flex: 1;

  .CodeMirror {
    max-width: 100%;
    height: auto;
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
    as={ButtonLink}
    title="Copy to clipboard"
    onClick={() => copy(content)}
    swap={<Check width={17} />}
  >
    <Clipboard width={15} />
  </ActionButton>
)

interface PreProps {
  children: any
  className?: string
  editorClassName?: string
  actions?: React.ReactNode
  readOnly?: boolean
  mode?: string
  matchBrackets?: boolean
  indentUnit?: number
  onChange?: (code: string) => any
}

export class Pre extends Component<PreProps> {
  public static defaultProps = {
    readOnly: true,
    mode: 'jsx',
    matchBrackets: true,
    indentUnit: 2,
  }

  public render(): JSX.Element {
    const { children, actions, onChange, ...props } = this.props
    const code = getChildren(this.props.children)
    const language = getLanguage(children)
    const mode = language || this.props.mode

    const options = {
      ...props,
      mode,
      inputStyle: 'contenteditable',
      gutter: true,
      lineNumbers: true,
      disableInput: true,
      tabSize: 2,
      theme: 'docz-light',
    }

    return (
      <Wrapper className={this.props.className}>
        <ThemeConfig>
          {config => (
            <Editor
              onChange={onChange}
              className={this.props.editorClassName}
              value={code}
              options={{
                ...options,
                theme:
                  config && config.themeConfig
                    ? config.themeConfig.codemirrorTheme
                    : options.theme,
              }}
            />
          )}
        </ThemeConfig>
        <Actions>{actions || <ClipboardAction content={code} />}</Actions>
      </Wrapper>
    )
  }
}
