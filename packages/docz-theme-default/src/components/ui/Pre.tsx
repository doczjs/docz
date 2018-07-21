import * as React from 'react'
import { SFC, Component, Fragment } from 'react'
import { ThemeConfig } from 'docz'
import styled, { css, cx } from 'react-emotion'
import rgba from 'polished/lib/color/rgba'
import Clipboard from 'react-feather/dist/icons/clipboard'
import Check from 'react-feather/dist/icons/check'
import SyntaxHighlighter from 'react-syntax-highlighter/prism-light'
import copy from 'copy-text-to-clipboard'

import { ButtonSwap } from './ButtonSwap'
import { ButtonLink } from './Button'

const PrismTheme = styled('pre')`
  ${p => p.theme.prismTheme};
  ${p => p.theme.mq(p.theme.styles.pre)};
  overflow-y: hidden;
  padding: 30px;
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
    padding: 0 15px;
    opacity: 0.3;
    text-align: right;
  }
`

const Actions = styled('div')`
  display: flex;
  flex-direction: column;
`

const CopyButton = styled(ButtonSwap)`
  padding: 7px 10px;
  background: transparent;
  font-size: 12px;
  text-transform: uppercase;
  color: ${p => rgba(p.theme.colors.text, 0.4)};
  transition: color 0.3s;

  &:hover {
    color: ${p => rgba(p.theme.colors.text, 0.7)};
  }
`

const Nullable: SFC = ({ children }) => <Fragment>{children}</Fragment>

const linesStyle = (colors: any) => ({
  padding: '30px 0',
  borderRight: `1px solid ${colors.border}`,
  background: rgba(colors.background, 0.5),
  left: 0,
})

interface PreProps {
  children: any
  className?: string
}

export class Pre extends Component<PreProps> {
  public render(): JSX.Element {
    const { children, className } = this.props
    const content = getChildren(children)

    const check = (
      <Check
        width={17}
        className={css`
          stroke: #00b894;
        `}
      />
    )

    return (
      <ThemeConfig>
        {config => (
          <Wrapper className={className}>
            <SyntaxHighlighter
              language="javascript"
              showLineNumbers
              useInlineStyles={false}
              lineProps={{ class: 'helo' }}
              lineNumberContainerStyle={linesStyle(config.colors)}
              PreTag={Nullable}
              CodeTag={getCode(children)}
            >
              {getChildren(content)}
            </SyntaxHighlighter>
            <Actions>
              <CopyButton
                as={ButtonLink}
                title="Copy to clipboard"
                onClick={() => copy(content)}
                swap={check}
              >
                <Clipboard width={15} />
              </CopyButton>
            </Actions>
          </Wrapper>
        )}
      </ThemeConfig>
    )
  }
}
