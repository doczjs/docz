import * as url from 'url'

import generate from '@babel/generator'
import t from '@babel/types'
import visit from 'unist-util-visit'
import remove from 'unist-util-remove'

// TODO: create types

// match component name by regexp
const componentName = (value: any) => {
  const match = value.match(/^\<\\?(\w+)/)
  return match && match[1]
}

// iterate in a reverse way to merge values then delete the unused node
const valuesFromNodes = (tree: any) => (first: number, last: number) => {
  const values = []

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

const mergeNodeWithoutCloseTag = (tree: any, node: any, idx: any) => {
  if (!node.value || typeof node.value !== 'string') return

  // parse component name and create two regexp to check open and close tag
  const component = componentName(node.value)
  const tagOpen = new RegExp(`^\\<${component}`)
  const tagClose = new RegExp(`\\<\\/${component}\\>$`)

  const hasOpenTag = (val: any) => tagOpen.test(val)
  const hasCloseTag = (val: any) => tagClose.test(val)
  const hasJustCloseTag = (val: any) =>
    val && !hasOpenTag(val) && hasCloseTag(val)

  // return default value is has open and close tag
  if (!component || (hasOpenTag(node.value) && hasCloseTag(node.value))) {
    return
  }

  // when some node has just the open tag
  // find node index with equivalent close tag
  const tagCloseIdx = tree.children.findIndex(({ value, children }: any) => {
    if (children) return children.some((c: any) => hasJustCloseTag(c.value))
    return hasJustCloseTag(value)
  })

  if (tagCloseIdx > -1 && tagCloseIdx !== idx) {
    // merge all values from node open tag until node with the close tag
    const mergeUntilCloseTag = valuesFromNodes(tree)
    const values = mergeUntilCloseTag(idx, tagCloseIdx)
    node.value = values.reverse().join('\n')
  }
}

const createImgSrc = (src: string) => {
  const parsed = url.parse(src)

  if (parsed.protocol) {
    return t.stringLiteral(src)
  }

  let { pathname } = parsed as { pathname: string }
  if (!/^\.[./]+/.test(pathname)) {
    pathname = `./${pathname}`
  }
  return t.jsxExpressionContainer(
    t.callExpression(t.identifier('require'), [t.stringLiteral(pathname)])
  )
}

const imageToJsx = (node: any): string =>
  generate(
    t.jsxOpeningElement(
      t.jsxIdentifier('img'),
      [
        t.jsxAttribute(t.jsxIdentifier('alt'), t.stringLiteral(node.alt)),
        t.jsxAttribute(t.jsxIdentifier('src'), createImgSrc(node.url)),
      ],
      true
    )
  ).code

// turns `html` nodes into `jsx` nodes
export default () => (tree: any) => {
  visit(
    tree,
    'image',
    (node: any, idx: any): void => {
      // check if a node has just open tag
      node.type = 'jsx'
      node.value = imageToJsx(node)
    }
  )
  visit(
    tree,
    'jsx',
    (node: any, idx: any): void => {
      // check if a node has just open tag
      mergeNodeWithoutCloseTag(tree, node, idx)
    }
  )
}
