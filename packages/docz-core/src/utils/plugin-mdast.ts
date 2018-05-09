import visit from 'unist-util-visit'
import remove from 'unist-util-remove'

const componentName = (value: string) => {
  const match = value.match(/^\<\\?(\w+)/)
  return match && match[1]
}

const valuesFromTreeNodes = (tree: any) => (first: number, last: number) => {
  const values: string[] = []

  if (first !== last) {
    for (let i = last; i >= first; i--) {
      const found = tree.children[i]

      if (found.children && found.children.length > 0) {
        values.push(...found.children.map((child: any) => child.value))
      }

      if (found.value && found.value.length > 0) {
        values.push(found.value)
      }

      if (i !== first) remove(tree, found)
    }
  }

  return values
}

export const plugin = () => (tree: any, file: any) => {
  visit(tree, 'html', visitor)

  function visitor(node: any, idx: any, parent: any): void {
    try {
      if (!node.value || typeof node.value !== 'string') return

      const component = componentName(node.value)
      const tagOpen = new RegExp(`^\\<${component}`)
      const tagClose = new RegExp(`\\<\\/${component}\\>$`)

      const hasOpenTag = (value: string) => tagOpen.test(value)
      const hasCloseTag = (value: string) => tagClose.test(value)

      if (!component || (hasOpenTag(node.value) && hasCloseTag(node.value)))
        return

      const tagCloseIdx = tree.children.findIndex(
        ({ value }: any) => value && !hasOpenTag(value) && hasCloseTag(value)
      )

      const mergeUntilCloseTag = valuesFromTreeNodes(tree)
      const values = mergeUntilCloseTag(idx, tagCloseIdx)

      node.value = values.reverse().join('\n')
    } catch (err) {
      console.log(err)
      return
    }
  }
}
