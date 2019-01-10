import * as jsxUtils from 'jsx-ast-utils'
import strip from 'strip-indent'
import escapeJS from 'js-string-escape'

import { valueFromTraverse, codeFromNode } from './ast'

export const propFromElement = (prop: string) =>
  valueFromTraverse(
    p => p.isJSXOpeningElement(),
    p => jsxUtils.getPropValue(jsxUtils.getProp(p.node.attributes, prop))
  )

export const removeTags = (code: string) => {
  const open = codeFromNode(p => p.isJSXOpeningElement())
  const close = codeFromNode(p => p.isJSXClosingElement())

  return code.replace(open(code), '').replace(close(code), '')
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
