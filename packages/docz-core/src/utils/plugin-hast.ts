import is from 'unist-util-is'
import nodeToString from 'hast-util-to-string'
import strip from 'strip-indent'

import { format } from '../utils/format'

const componentName = (value: any) => {
  const match = value.match(/^\<\\?(\w+)/)
  return match && match[1]
}

const removePlayground = (code: string) =>
  code
    .replace(/^(\<Playground\>)|(\<Playground.+\>)$/g, '')
    .replace(/\<\/Playground\>/g, '')

const isPlayground = (name: string) => name === 'Playground'

const addCodeProp = async (node: any) => {
  const name = componentName(node.value)
  const tagOpen = new RegExp(`^\\<${name}`)

  if (isPlayground(name)) {
    const formatted = await format(nodeToString(node))
    const code = formatted.slice(1, Infinity)
    const child = strip(removePlayground(code)).trim()

    const codeComponent = `components && (
      <components.pre className="react-prism language-jsx">
        <code>{\`${child}\`}</code>
      </components.pre>
    )`

    node.value = node.value.replace(
      tagOpen,
      `<${name} __code={(components) => ${codeComponent}}`
    )
  }
}

export const plugin = () => (tree: any, file: any) => {
  async function visitor(node: any): Promise<void> {
    await addCodeProp(node)
  }

  const nodes = [
    tree.children.filter((node: any) => is('jsx', node)).map(visitor),
  ]

  return Promise.all(nodes).then(() => tree)
}
