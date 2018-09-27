import * as path from 'path'
import is from 'unist-util-is'
import flatten from 'lodash.flatten'
import nodeToString from 'hast-util-to-string'
import { jsx, imports as imps } from 'docz-utils'
import { format } from 'docz-utils/lib/format'
import { getSandboxImportInfo } from 'docz-utils/lib/codesandbox'

const isPlayground = (name: string) => name === 'Playground'

const addPropsOnPlayground = async (
  node: any,
  idx: number,
  scopes: string[],
  imports: string[],
  cwd: string
) => {
  const name = jsx.componentName(node.value)
  const tagOpen = new RegExp(`^\\<${name}`)

  if (isPlayground(name)) {
    const formatted = await format(nodeToString(node))
    const code = formatted.slice(1, Infinity)
    const scope = `{props,${scopes.join(',')}}`
    const child = jsx.sanitizeCode(jsx.removeTags(code))
    const codesandBoxInfo = await getSandboxImportInfo(child, imports, cwd)

    node.value = node.value.replace(
      tagOpen,
      `<${name} __position={${idx}} __codesandbox={\`${codesandBoxInfo}\`} __code={\`${child}\`} __scope={${scope}}`
    )
  }
}

const addComponentsProps = (
  scopes: string[],
  imports: string[],
  cwd: string
) => async (node: any, idx: number) => {
  await addPropsOnPlayground(node, idx, scopes, imports, cwd)
}

export default (root: string) => () => (tree: any, fileInfo: any) => {
  const importNodes = tree.children.filter((node: any) => is('import', node))
  const imports: string[] = flatten(importNodes.map(imps.getFullImports))
  const scopes: string[] = flatten(importNodes.map(imps.getImportsVariables))
  const fileCwd = path.relative(root, path.dirname(fileInfo.history[0]))

  const nodes = tree.children
    .filter((node: any) => is('jsx', node))
    .map(addComponentsProps(scopes, imports, fileCwd))

  return Promise.all(nodes).then(() => tree)
}
