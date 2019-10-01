/** @jsx jsx */
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import { jsx, Styled } from 'theme-ui'

import { usePrismTheme } from '~utils/theme'

export interface CodeProps {
  children: string
  className?: string
}

export const Code: React.FunctionComponent<CodeProps> = ({
  children,
  className: outerClassName,
}) => {
  const language: Language = outerClassName
    ? (outerClassName.replace(/language-/, '').split(' ')[0] as Language)
    : ('text' as Language)
  const theme = usePrismTheme()

  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Styled.pre
          className={`${outerClassName || ''} ${className}`}
          style={style}
          data-testid="code"
        >
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span
                  {...getTokenProps({ token, key })}
                  sx={{ display: 'inline-block' }}
                />
              ))}
            </div>
          ))}
        </Styled.pre>
      )}
    </Highlight>
  )
}
