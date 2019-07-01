/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import { useConfig } from 'docz'
import { get } from 'lodash/fp'
import AceEditor from 'react-ace'

import 'brace/theme/dracula'
import 'brace/theme/textmate'
import 'brace/mode/jsx'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'

import * as styles from './styles'

const LANGUAGES = [
  'javascript',
  'python',
  'ruby',
  'sass',
  'markdown',
  'mysql',
  'json',
  'html',
  'golang',
  'elixir',
  'typescript',
  'css',
]

LANGUAGES.forEach(lang => {
  require(`brace/mode/${lang}`)
  require(`brace/snippets/${lang}`)
})

const themes = {
  light: 'textmate',
  dark: 'dracula',
}

const getLanguage = lang => {
  const defaultLanguage = 'jsx'
  if (typeof lang === 'string') return defaultLanguage

  const language = getter(lang, 'props.props.className') || defaultLanguage
  const result = language.replace('language-', '')

  if (result === 'js' || result === 'javascript') return 'jsx'
  if (result === 'ts' || result === 'tsx' || result === 'typescript') {
    return 'text/typescript'
  }
  return result
}

export const Code = ({
  className,
  codeString,
  language = 'jsx',
  readOnly,
  onChange,
}) => {
  const [colorMode] = useColorMode()
  const config = useConfig()
  const lang = getLanguage(language)
  const theme = get('themeConfig.editorTheme', config)

  return (
    <AceEditor
      className={className}
      sx={styles.editor}
      value={codeString}
      mode={lang}
      readOnly={readOnly}
      onChange={onChange}
      highlightActiveLine={false}
      theme={theme || themes[colorMode]}
      name="code-editor"
      fontSize={16}
      style={{
        width: 'calc(100% - 2px)',
        height: 200,
      }}
      setOptions={{
        tabSize: 2,
        minLines: 5,
        maxLines: 20,
        wrap: true,
        autoScrollEditorIntoView: true,
        printMargin: false,
      }}
      editorProps={{
        $blockScrolling: Infinity,
      }}
    />
  )
}
