import visit from 'unist-util-visit'
import prism from 'node-prismjs'
import nodeToString from 'hast-util-to-string'

import { format } from '../utils/format'

const componentName = (value: any) => {
  const match = value.match(/^\<\\?(\w+)/)
  return match && match[1]
}

const isPlayground = (name: string) => name === 'Playground'
const isPropsTable = (name: string) => name === 'PropsTable'

const addCodeProp = (node: any) => {
  const name = componentName(node.value)
  const tagOpen = new RegExp(`^\\<${name}`)

  if (isPlayground(name)) {
    const code = format(nodeToString(node)).slice(1, Infinity)
    const html = prism.highlight(code, prism.languages.jsx)

    const codeComponent = `(
      <pre className="react-prism language-jsx">
        <code dangerouslySetInnerHTML={{ __html: \`${html}\` }} />
      </pre>
    )`

    node.value = node.value.replace(
      tagOpen,
      `<${name} __code={${codeComponent}}`
    )
  }
}

const addComponentsProp = (node: any) => {
  const name = componentName(node.value)

  if (isPlayground(name) || isPropsTable(name)) {
    const tagOpen = new RegExp(`^\\<${name}`)
    node.value = node.value.replace(tagOpen, `<${name} components={components}`)
  }
}

export const plugin = () => (tree: any, file: any) => {
  visit(tree, 'jsx', visitor)

  function visitor(node: any, idx: any, parent: any): void {
    addCodeProp(node)
    addComponentsProp(node)
  }
}
