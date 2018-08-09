import is from 'unist-util-is'
import nodeToString from 'hast-util-to-string'
import strip from 'strip-indent'

import { codeFromNode } from './code-from-node'
import { format } from './format'

const componentName = (value: any) => {
  const match = value.match(/^\<\\?(\w+)/)
  return match && match[1]
}

const isPlayground = (name: string) => name === 'Playground'

const isOpenTag = (p: any) =>
  p.isJSXOpeningElement() && isPlayground(p.node.name.name)

const isClosetag = (p: any) =>
  p.isJSXClosingElement() && isPlayground(p.node.name.name)

const removePlayground = (code: string) => {
  const open = codeFromNode(isOpenTag)
  const close = codeFromNode(isClosetag)

  return code.replace(open(code), '').replace(close(code), '')
}

const addCodeProp = async (node: any, idx: number) => {
  const name = componentName(node.value)
  const tagOpen = new RegExp(`^\\<${name}`)
  if (isPlayground(name)) {
    const formatted = await format(nodeToString(node))
    const code = formatted.slice(1, Infinity)

    const child = strip(removePlayground(code))
      .trim()
      .split(`'`)
      .join(`\\'`)
      .split('`')
      .join('\\`')

    node.value = node.value.replace(
      tagOpen,
      `<${name} __position={${idx}} __code={\`${child}\`}`
    )
  }
}

export default () => (tree: any) => {
  const nodes = [
    tree.children.filter((node: any) => is('jsx', node)).map(addCodeProp),
  ]

  return Promise.all(nodes).then(() => tree)
}
