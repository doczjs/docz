import is from 'unist-util-is'
import nodeToString from 'hast-util-to-string'

import { format } from '../utils/format'

const componentName = (value: any) => {
  const match = value.match(/^\<\\?(\w+)/)
  return match && match[1]
}

const isPlayground = (name: string) => name === 'Playground'
const isPropsTable = (name: string) => name === 'PropsTable'

const addCodeProp = async (node: any) => {
  const name = componentName(node.value)
  const tagOpen = new RegExp(`^\\<${name}`)

  if (isPlayground(name)) {
    const formatted = await format(nodeToString(node))
    const code = formatted.slice(1, Infinity)

    const codeComponent = `(
      <components.pre className="react-prism language-jsx">
        <code>{\`${code}\`}</code>
      </components.pre>
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
  async function visitor(node: any): Promise<void> {
    await addCodeProp(node)
    addComponentsProp(node)
  }

  const nodes = [
    tree.children.filter((node: any) => is('jsx', node)).map(visitor),
  ]

  return Promise.all(nodes).then(() => tree)
}
