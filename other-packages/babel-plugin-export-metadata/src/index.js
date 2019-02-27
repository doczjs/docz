const { default: template } = require('@babel/template')
const { get } = require('lodash')

const buildFileMeta = template(`
  if (typeof ID !== 'undefined' && ID && ID === Object(ID)) {
    Object.defineProperty(ID, '__filemeta', {
      enumerable: true,
      configurable: true,
      value: {
        name: NAME,
        filename: FILENAME
      }
    });
  }
`)

const getFilename = state => get(state, 'file.opts.filename')

const getPathName = path =>
  get(path, 'node.id.name') || get(path, 'parent.id.name')

const findPathToInsert = path =>
  path.parent.type === 'Program' && path.insertAfter
    ? path
    : findPathToInsert(path.parentPath)

const checkReverseOnThree = (pred = () => false) => (path, is) => {
  const parentType = path.parent.type
  if (parentType === 'Program') return Boolean(is)
  if (pred(parentType)) return true
  return checkReverseOnThree(pred)(path.parentPath, false)
}

const checkIfIsInsideAnObject = checkReverseOnThree(
  type => type === 'ObjectProperty' || type === 'ClassProperty'
)

const checkIfIsExported = checkReverseOnThree(
  type =>
    type === 'ExportNamedDeclaration' || type === 'ExportDefaultDeclaration'
)

const insertNode = t => (path, state) => {
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

module.exports = function({ types: t }) {
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
