/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import AceEditor from 'react-ace'

import 'brace/theme/dracula'
import 'brace/theme/textmate'
import 'brace/mode/jsx'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'

import * as styles from './styles'

const languages = [
  'javascript',
  'java',
  'python',
  'xml',
  'ruby',
  'sass',
  'markdown',
  'mysql',
  'json',
  'html',
  'handlebars',
  'golang',
  'csharp',
  'elixir',
  'typescript',
  'css',
]

languages.forEach(lang => {
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
  const lang = getLanguage(language)
  return (
    <AceEditor
      className={className}
      sx={styles.editor}
      value={codeString}
      mode={lang}
      readOnly={readOnly}
      onChange={onChange}
      highlightActiveLine={false}
      theme={themes[colorMode]}
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
