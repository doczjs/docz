import is from 'unist-util-is'
import nodeToString from 'hast-util-to-string'
import strip from 'strip-indent'
import flatten from 'lodash.flatten'

import { codeFromNode } from './code-from-node'
import { importsFromEntry } from './imports-from-entry'
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

const addCodeProp = (imports: string[]) => async (node: any, idx: number) => {
  const name = componentName(node.value)
  const tagOpen = new RegExp(`^\\<${name}`)
  if (isPlayground(name)) {
    const formatted = await format(nodeToString(node))
    const code = formatted.slice(1, Infinity)
    const scope = `{${imports.join(',')}}`
    const child = strip(removePlayground(code))
      .trim()
      .replace(/'/g, `\\'`)
      .replace(/`/g, '\\`')

    node.value = node.value.replace(
      tagOpen,
      `<${name} __position={${idx}} __code={\`${child}\`} __scope={${scope}}`
    )
  }
}

const getScope = (node: any, idx: number) => {
  return importsFromEntry(node)
}

export default () => (tree: any) => {
  const imports: string[] = flatten(
    tree.children.filter((node: any) => is('import', node)).map(getScope)
  )

  const nodes = [
    tree.children
      .filter((node: any) => is('jsx', node))
      .map(addCodeProp(imports)),
  ]

  return Promise.all(nodes).then(() => tree)
}
