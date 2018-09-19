import is from 'unist-util-is'
import nodeToString from 'hast-util-to-string'
import strip from 'strip-indent'
import flatten from 'lodash.flatten'
import * as path from 'path'

import { codeFromNode } from './code-from-node'
import { importsFromEntry, scopesFromEntry } from './imports-from-entry'
import { format } from './format'
import { getCodeSandboxFiles } from './codesandbox-files'

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

const sanitizeCode = (code: string) =>
  strip(code)
    .trim()
    .replace(/'/g, `\\'`)
    .replace(/`/g, '\\`')

const addCodeProp = (
  scopes: string[],
  imports: string[],
  cwd: string
) => async (node: any, idx: number) => {
  const name = componentName(node.value)
  const tagOpen = new RegExp(`^\\<${name}`)

  if (isPlayground(name)) {
    const formatted = await format(nodeToString(node))
    const code = formatted.slice(1, Infinity)
    const scope = `{props,${scopes.join(',')}}`
    const child = sanitizeCode(removePlayground(code))

    let codeSandboxImportInfo: string | undefined
    try {
      const { parameters } = await getCodeSandboxFiles(child, imports, cwd)
      codeSandboxImportInfo = parameters
    } catch (e) {
      console.error('Could not create Open in CodeSandbox', e)
    }

    node.value = node.value.replace(
      tagOpen,
      `<${name} __position={${idx}} __codesandbox={\`${codeSandboxImportInfo}\`} __code={\`${child}\`} __scope={${scope}}`
    )
  }
}

export default () => (tree: any, fileInfo: any) => {
  const importNodes = tree.children.filter((node: any) => is('import', node))
  const imports: string[] = flatten(importNodes.map(importsFromEntry))
  const scopes: string[] = flatten(importNodes.map(scopesFromEntry))

  const nodes = tree.children
    .filter((node: any) => is('jsx', node))
    .map(addCodeProp(scopes, imports, path.dirname(fileInfo.history[0])))

  return Promise.all(nodes).then(() => tree)
}
