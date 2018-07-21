import * as React from 'react'
import { SFC, Fragment } from 'react'
import { ThemeConfig } from 'docz'
import rgba from 'polished/lib/color/rgba'
import styled, { cx } from 'react-emotion'
import SyntaxHighlighter from 'react-syntax-highlighter/prism-light'

const PrismTheme = styled('pre')`
  ${p => p.theme.prismTheme};
  ${p => p.theme.mq(p.theme.styles.pre)};
  padding: 30px;
  margin: 0;
  flex: 1;
`

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
  overflow-y: hidden;
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

export const Pre: SFC<PreProps> = ({ children, className }) => (
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
          {children && typeof children !== 'string'
            ? children.props.children
            : children}
        </SyntaxHighlighter>
      </Wrapper>
    )}
  </ThemeConfig>
)
