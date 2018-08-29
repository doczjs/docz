import * as React from 'react'
import { SFC } from 'react'
import { ThemeConfig } from 'docz'
import { Value } from 'react-powerplug'
import styled from 'react-emotion'
import rgba from 'polished/lib/color/rgba'
import BaseCheck from 'react-feather/dist/icons/check'
import Clipboard from 'react-feather/dist/icons/clipboard'
import { Controlled as CodeMirror } from 'react-codemirror2'
import copy from 'copy-text-to-clipboard'
import get from 'lodash.get'

import { ButtonSwap } from '../ButtonSwap'
import { ButtonLink } from '../Button'
import * as themes from '../../../styles/codemirror'

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
  children && typeof children !== 'string'
    ? get(children, 'props.children')
    : children

const Wrapper = styled('div')`
  margin: 30px 0;
  position: relative;
  overflow-y: auto;
`

const EditorStyled = styled(CodeMirror)`
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
  language?: string
}

export const Editor: SFC<PreProps> = ({
  mode,
  children,
  actions,
  onChange,
  className,
  editorClassName,
  language: defaultLanguage,
  ...props
}) => {
  const code = getChildren(children)
  const language = defaultLanguage || getLanguage(children)

  const options = {
    ...props,
    tabSize: 2,
    mode: language || mode,
    lineNumbers: true,
    lineWrapping: true,
    theme: 'docz-light',
  }

  return (
    <Wrapper className={className}>
      <ThemeConfig>
        {config => (
          <Value initial={code}>
            {({ set, value }: any) => (
              <EditorStyled
                value={value}
                className={editorClassName}
                onViewportChange={() => console.log('helo')}
                editorDidMount={(editor: any) => {
                  if (editor && props.readOnly) {
                    const lastLine = editor.lastLine()
                    editor.doc.replaceRange(
                      '',
                      { line: lastLine - 1 },
                      { line: lastLine }
                    )
                  }
                }}
                onBeforeChange={(editor: any, data: any, value: string) => {
                  onChange && onChange(value)
                  set(value)
                }}
                options={{
                  ...options,
                  theme:
                    config && config.themeConfig
                      ? config.themeConfig.codemirrorTheme
                      : options.theme,
                }}
              />
            )}
          </Value>
        )}
      </ThemeConfig>
      <Actions>{actions || <ClipboardAction content={code} />}</Actions>
    </Wrapper>
  )
}

Editor.defaultProps = {
  mode: 'js',
  readOnly: true,
  matchBrackets: true,
  indentUnit: 2,
}
