import template from '@babel/template'
import { get } from 'lodash'

const buildFileMeta = template(`
  if (typeof ID !== 'undefined') {
    ID.__filemeta = {
      name: NAME,
      filename: FILENAME
    };
  }
`)

const getFilename = (state: any) => get(state, 'file.opts.filename')

const getPathName = (path: any) =>
  get(path, 'node.id.name') || get(path, 'parent.id.name')

const findPathToInsert = (path: any): any =>
  path.parent.type === 'Program' && path.insertAfter
    ? path
    : findPathToInsert(path.parentPath)

const checkReverseOnThree = (pred: (type: string) => boolean = () => false) => (
  path: any,
  is?: boolean
): boolean => {
  const parentType = path.parent.type
  if (parentType === 'Program') return Boolean(is)
  if (pred(parentType)) return true
  return checkReverseOnThree(pred)(path.parentPath, false)
}

const checkIfIsInsideAnObject = checkReverseOnThree(
  (type: string) => type === 'ObjectProperty' || type === 'ClassProperty'
)

const checkIfIsExported = checkReverseOnThree(
  type =>
    type === 'ExportNamedDeclaration' || type === 'ExportDefaultDeclaration'
)

const insertNode = (t: any) => (path: any, state: any) => {
  const filename = getFilename(state)
  const name = getPathName(path)
  const isInsideObject = checkIfIsInsideAnObject(path)
  const isExported = checkIfIsExported(path)

  if (filename && name && !isInsideObject && isExported) {
    const pathToInsert = findPathToInsert(path)
    const newNode = buildFileMeta({
      ID: t.identifier(name),
      NAME: t.stringLiteral(name),
      FILENAME: t.stringLiteral(filename),
    })

    pathToInsert.insertAfter(newNode)
  }
}

export default function({ types: t }: any): any {
  const insert = insertNode(t)

  return {
    visitor: {
      FunctionDeclaration: insert,
      ClassDeclaration: insert,
      ArrowFunctionExpression: insert,
      VariableDeclarator: insert,
    },
  }
}
