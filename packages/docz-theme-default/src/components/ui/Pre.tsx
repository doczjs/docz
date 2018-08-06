import * as React from 'react'
import { SFC, Component, Fragment } from 'react'
import { ThemeConfig } from 'docz'
import styled, { cx } from 'react-emotion'
import rgba from 'polished/lib/color/rgba'
import lighten from 'polished/lib/color/lighten'
import darken from 'polished/lib/color/darken'
import BaseCheck from 'react-feather/dist/icons/check'
import SyntaxHighlighter from 'react-syntax-highlighter/prism-light'
import Clipboard from 'react-feather/dist/icons/clipboard'
import copy from 'copy-text-to-clipboard'
import get from 'lodash.get'

import { ButtonSwap } from './ButtonSwap'
import { ButtonLink } from './Button'

const TOP_PADDING = '15px'

const PrismTheme = styled('pre')`
  ${p => p.theme.docz.prismTheme};
  ${p => p.theme.docz.mq(p.theme.docz.styles.pre)};
  overflow-y: hidden;
  padding: ${TOP_PADDING} 20px;
  margin: 0;
  flex: 1;
`

const getChildren = (children: any) =>
  children && typeof children !== 'string' ? children.props.children : children

const getLanguage = (children: any) => {
  const defaultLanguage = 'language-jsx'
  if (typeof children === 'string') return defaultLanguage
  return get(children, 'props.props.className') || defaultLanguage
}

const getCode = (content: any): SFC => ({ children }) => {
  const className = cx('react-prism', getLanguage(content))
  return <PrismTheme className={className}>{children}</PrismTheme>
}

const Wrapper = styled('div')`
  display: flex;
  position: relative;
  border: 1px solid ${p => p.theme.docz.colors.border};
  border-radius: 5px;
  background: ${p => darken(0.01, p.theme.docz.colors.preBg)};
  ${p => p.theme.docz.mq(p.theme.docz.styles.pre)};

  .react-syntax-highlighter-line-number {
    display: block;
    padding: 0 10px;
    opacity: 0.3;
    text-align: right;
  }
`

const Actions = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 10px;
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

const Nullable: SFC = ({ children }) => <Fragment>{children}</Fragment>

const linesStyle = ({ mode, colors }: any) => ({
  padding: `${TOP_PADDING} 3px`,
  borderRight: `1px solid ${colors.border}`,
  background:
    mode === 'light'
      ? lighten(0.13, colors.border)
      : darken(0.04, colors.border),
  left: 0,
})

interface PreProps {
  children: any
  className?: string
  actions?: React.ReactNode
}

export class Pre extends Component<PreProps> {
  public render(): JSX.Element {
    const { children, className, actions } = this.props
    const content = getChildren(children)

    return (
      <ThemeConfig>
        {config => (
          <Wrapper className={className}>
            <SyntaxHighlighter
              language="javascript"
              showLineNumbers
              useInlineStyles={false}
              lineNumberContainerStyle={linesStyle(config.themeConfig)}
              PreTag={Nullable}
              CodeTag={getCode(children)}
            >
              {getChildren(content)}
            </SyntaxHighlighter>
            <Actions>
              {actions || <ClipboardAction content={content} />}
            </Actions>
          </Wrapper>
        )}
      </ThemeConfig>
    )
  }
}
