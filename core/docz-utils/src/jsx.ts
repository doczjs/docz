import * as jsxUtils from 'jsx-ast-utils'
import strip from 'strip-indent'
import escapeJS from 'js-string-escape'

import { valueFromTraverse } from './ast'

export const propFromElement = (prop: string) =>
  valueFromTraverse(
    p => p.isJSXOpeningElement(),
    p => jsxUtils.getPropValue(jsxUtils.getProp(p.node.attributes, prop))
  )

const getTagContentsRange = valueFromTraverse<[number, number] | null>(
  p => p.isJSXElement(),
  ({ node }) => {
    if (!node.closingElement) {
      // if the JSX element doesn't have a closingElement, it's because it's self-closed
      // and thus does not have any content: <Playground />
      return null
    }
    return [node.openingElement.end, node.closingElement.start]
  }
)

export const removeTags = (code: string) => {
  const [start, end] = getTagContentsRange(code) || [0, 0]
  return code.slice(start, end)
}

export const sanitizeCode = (code: string) => {
  const trimmed = strip(code).trim()
  const newCode =
    trimmed.startsWith('{') && trimmed.endsWith('}')
      ? trimmed.substr(1, trimmed.length - 2).trim()
      : trimmed

  return escapeJS(strip(newCode))
}

export const componentName = (value: any) => {
  const match = value.match(/^\<\\?(\w+)/)
  return match && match[1]
}
