/** @jsx jsx */
import { useConfig } from 'docz'
import { jsx, Styled } from 'theme-ui'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { get } from 'lodash/fp'

export const Code = ({ codeString, language = 'jsx' }) => {
  const config = useConfig()
  const theme = get('themeConfig.prismjs', config)

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={codeString}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Styled.pre className={className} style={style}>
          {tokens.map((line, i) => {
            if (line.length === 1 && line[0].empty) return null
            return (
              <div key={line} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            )
          })}
        </Styled.pre>
      )}
    </Highlight>
  )
}
