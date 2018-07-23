import * as React from 'react'
import { SFC, Component, Fragment } from 'react'
import { ThemeConfig } from 'docz'
import styled, { cx } from 'react-emotion'
import rgba from 'polished/lib/color/rgba'
import BaseCheck from 'react-feather/dist/icons/check'
import SyntaxHighlighter from 'react-syntax-highlighter/prism-light'
import Clipboard from 'react-feather/dist/icons/clipboard'
import copy from 'copy-text-to-clipboard'

import { ButtonSwap } from './ButtonSwap'
import { ButtonLink } from './Button'

const TOP_PADDING = '25px'

const PrismTheme = styled('pre')`
  ${p => p.theme.prismTheme};
  ${p => p.theme.mq(p.theme.styles.pre)};
  overflow-y: hidden;
  padding: ${TOP_PADDING} 20px;
  margin: 0;
  flex: 1;
`

const getChildren = (children: any) => {
  return children && typeof children !== 'string'
    ? children.props.children
    : children
}

const getLanguage = (children: any) => {
  if (typeof children === 'string') return 'language-jsx'
  return children.props.props.className
}

const getCode = (content: any): SFC => ({ children }) => {
  const className = cx('react-prism', getLanguage(content))
  return <PrismTheme className={className}>{children}</PrismTheme>
}

const Wrapper = styled('div')`
  display: flex;
  position: relative;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 5px;
  background: ${p => p.theme.colors.preBg};
  ${p => p.theme.mq(p.theme.styles.pre)};

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
  color: ${p => rgba(p.theme.colors.text, 0.4)};
  transition: color 0.3s;

  &:hover {
    color: ${p => rgba(p.theme.colors.text, 0.7)};
  }
`

const Check = styled(BaseCheck)`
  stroke: ${p => p.theme.colors.primary};
`

export const ClipboardAction: SFC<{ content: string }> = ({ content }) => (
  <ActionButton
    as={ButtonLink}
    title="Copy to clipboard"
    onClick={() => copy(content)}
    swap={<Check width={17} />}
  >
    <Clipboard width={15} />
  </ActionButton>
)

const Nullable: SFC = ({ children }) => <Fragment>{children}</Fragment>

const linesStyle = (colors: any) => ({
  padding: `${TOP_PADDING} 0`,
  borderRight: `1px solid ${colors.border}`,
  background: rgba(colors.background, 0.5),
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
              lineNumberContainerStyle={linesStyle(config.colors)}
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
