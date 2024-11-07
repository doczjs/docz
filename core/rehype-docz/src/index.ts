import flatten from 'lodash/flatten'
import nodeToString from 'hast-util-to-string'
import { format } from 'docz-utils/lib/format'
import { componentName, sanitizeCode, removeTags } from 'docz-utils/lib/jsx'
import { getImportsVariables } from 'docz-utils/lib/imports'
import { getExportsVariables } from 'docz-utils/lib/exports'

const isPlayground = (name: string) => {
  return name === 'Playground'
}

const addComponentsProps =
  (scopes: string[]) => async (node: any, idx: number) => {
    const name = componentName(node.value)
    const tagOpen = new RegExp(`^\\<${name}`)

    if (isPlayground(name)) {
      const formatted = await format(nodeToString(node))
      const code = formatted.slice(1, Infinity)
      const scope = `{props,${scopes.join(',')}}`
      const child = sanitizeCode(removeTags(code))

      node.value = node.value.replace(
        tagOpen,
        `<${name} __position={${idx}} __code={'${child}'} __scope={${scope}}`
      )
    }
  }

export interface PluginOpts {
  root: string
}

export default () => (tree: any) => {
  const importNodes = tree.children.filter((n: any) => n.type === 'import')
  const exportNodes = tree.children.filter((n: any) => n.type === 'export')
  const importedScopes = flatten<string>(importNodes.map(getImportsVariables))
  const exportedScopes = flatten<string>(exportNodes.map(getExportsVariables))
  // filter added to avoid throwing if an unexpected type is exported
  const scopes: string[] = [...importedScopes, ...exportedScopes].filter(
    Boolean
  )
  const nodes = tree.children
    .filter((node: any) => node.type === 'jsx')
    .map(addComponentsProps(scopes))

  return Promise.all(nodes).then(() => tree)
}
