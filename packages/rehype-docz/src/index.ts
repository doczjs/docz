import * as path from 'path'
import * as fs from 'fs-extra'
import is from 'unist-util-is'
import flatten from 'lodash.flatten'
import nodeToString from 'hast-util-to-string'
import { format } from 'docz-utils'

import { removeTags, propFromElement, sanitizeCode } from './jsx'
import { getImportPath, importsFromEntry, scopesFromEntry } from './imports'
import { getSandboxImportInfo } from './codesandbox'

const componentName = (value: any) => {
  const match = value.match(/^\<\\?(\w+)/)
  return match && match[1]
}

const addExtension = (filepath: string) => {
  const ext = ['.js', '.jsx', '.ts', '.tsx'].find(ext =>
    fs.pathExistsSync(`${filepath}${ext}`)
  )

  return `${filepath}${ext}`
}

const isPlayground = (name: string) => name === 'Playground'
const isPropsTable = (name: string) => name === 'PropsTable'

const addPropsOnComponents = (
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
    const child = sanitizeCode(removeTags(code))
    const codesandBoxInfo = await getSandboxImportInfo(child, imports, cwd)

    node.value = node.value.replace(
      tagOpen,
      `<${name} __position={${idx}} __codesandbox={\`${codesandBoxInfo}\`} __code={\`${child}\`} __scope={${scope}}`
    )
  }

  if (isPropsTable(name)) {
    const formatted = await format(nodeToString(node))
    const code = formatted.slice(1, Infinity)
    const valueFromOf = propFromElement('of')
    const variable = valueFromOf(code)
    const filepath = getImportPath(imports, val => val.includes(variable))
    const fullpath =
      filepath &&
      addExtension(
        filepath.startsWith('.') ? path.resolve(cwd, filepath) : filepath
      )

    if (fullpath) {
      node.value = node.value.replace(
        tagOpen,
        `<${name} __componentPath="${fullpath}"`
      )
    }
  }
}

export default () => (tree: any, fileInfo: any) => {
  const importNodes = tree.children.filter((node: any) => is('import', node))
  const imports: string[] = flatten(importNodes.map(importsFromEntry))
  const scopes: string[] = flatten(importNodes.map(scopesFromEntry))
  const fileCwd = path.dirname(fileInfo.history[0])

  const nodes = tree.children
    .filter((node: any) => is('jsx', node))
    .map(addPropsOnComponents(scopes, imports, fileCwd))

  return Promise.all(nodes).then(() => tree)
}
