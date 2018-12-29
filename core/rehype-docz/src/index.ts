import * as path from 'path'
import is from 'unist-util-is'
import flatten from 'lodash.flatten'
import nodeToString from 'hast-util-to-string'
import { format } from 'docz-utils/lib/format'
import { componentName, sanitizeCode, removeTags } from 'docz-utils/lib/jsx'
import { getSandboxImportInfo } from 'docz-utils/lib/codesandbox'
import { getFullImports, getImportsVariables } from 'docz-utils/lib/imports'

const isPlayground = (name: string) => name === 'Playground'

const addPropsOnPlayground = async (
  node: any,
  idx: number,
  scopes: string[],
  imports: string[],
  cwd: string,
  useCodeSandbox: boolean
) => {
  const name = componentName(node.value)
  const tagOpen = new RegExp(`^\\<${name}`)

  if (isPlayground(name)) {
    const formatted = await format(nodeToString(node))
    const code = formatted.slice(1, Infinity)
    const scope = `{props: this ? this.props : props,${scopes.join(',')}}`
    const child = sanitizeCode(removeTags(code))

    node.value = node.value.replace(
      tagOpen,
      `<${name} __position={${idx}} __code={'${child}'} __scope={${scope}}`
    )

    if (useCodeSandbox) {
      const codesandBoxInfo = await getSandboxImportInfo(child, imports, cwd)

      node.value = node.value.replace(
        tagOpen,
        `<${name} __codesandbox={\`${codesandBoxInfo}\`}`
      )
    }
  }
}

const addComponentsProps = (
  scopes: string[],
  imports: string[],
  cwd: string,
  useCodeSandbox: boolean
) => async (node: any, idx: number) => {
  await addPropsOnPlayground(node, idx, scopes, imports, cwd, useCodeSandbox)
}

export default (root: string, useCodeSandbox: boolean) => () => (
  tree: any,
  fileInfo: any
) => {
  const importNodes = tree.children.filter((node: any) => is('import', node))
  const imports: string[] = flatten(importNodes.map(getFullImports))
  const scopes: string[] = flatten(importNodes.map(getImportsVariables))
  const fileCwd = path.relative(root, path.dirname(fileInfo.history[0]))

  const nodes = tree.children
    .filter((node: any) => is('jsx', node))
    .map(addComponentsProps(scopes, imports, fileCwd, useCodeSandbox))

  return Promise.all(nodes).then(() => tree)
}
