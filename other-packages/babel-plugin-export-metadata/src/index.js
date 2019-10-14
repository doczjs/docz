const path = require('path')
const { default: template } = require('@babel/template')
const { get } = require('lodash')

const buildFileMeta = template(`
  if (typeof ID !== 'undefined' && ID && ID === Object(ID) && Object.isExtensible(ID) && !ID.hasOwnProperty('__filemeta')) {
    Object.defineProperty(ID, '__filemeta', {
      configurable: true,
      value: {
        name: NAME,
        filename: FILENAME
      }
    });
  }
`)

const replaceExportDefault = template(`
  import NAME from 'SOURCE'
  export default NAME
`)

const getFilename = state => {
  const rootDir = get(state, 'opts.root', process.cwd())
  const filename = get(state, 'file.opts.filename')
  let filepath = filename && path.relative(rootDir, filename)
  if (process.platform === 'win32') filepath = filepath.split('\\').join('/')
  return filepath
}

const findPathToInsert = path =>
  path.parent.type === 'Program' && path.insertAfter
    ? path
    : findPathToInsert(path.parentPath)

const addFileMetaProperties = (t, path, filename, name) => {
  if (!filename || !name) {
    return
  }

  const pathToInsert = findPathToInsert(path)
  const newNode = buildFileMeta({
    ID: t.identifier(name),
    NAME: t.stringLiteral(name),
    FILENAME: t.stringLiteral(filename),
  })

  pathToInsert.insertAfter(newNode)
}

const renameDefaultAddFileMetaProperties = (t, path, filename, name) => {
  if (!filename || !name) {
    return
  }

  const sourceValue = get(path, 'node.source.value')
  const localeName = get(path, 'node.specifiers[0].local.name')
  const pathToInsert = findPathToInsert(path)

  const fallbackName =
    localeName === 'default' ? '__DOCZ_DUMMY_EXPORT_DEFAULT' : localeName

  // replace
  const nameExport = replaceExportDefault({
    NAME: fallbackName,
    SOURCE: sourceValue,
  })

  pathToInsert.replaceWithMultiple(nameExport)
}

const insertNodeExport = t => (path, state) => {
  const filename = getFilename(state)
  if (/(\.cache|\.docz).+/.test(filename)) return

  const name = get(path, 'node.declaration.id.name')
  const declarations = get(path, 'node.declaration.declarations')
  const specifiers = get(path, 'node.specifiers')

  if (name) {
    addFileMetaProperties(t, path, filename, name)
  } else if (declarations) {
    for (declaration of declarations) {
      const declarationName = get(declaration, 'id.name')
      addFileMetaProperties(t, path, filename, declarationName)
    }
  } else if (specifiers && !state.opts.notUseSpecifiers) {
    for (specifier of specifiers) {
      const localName = get(specifier, 'local.name')
      const exportedName = get(specifier, 'exported.name')
      const source = get(path, 'node.source')
      if (source && exportedName === 'default') {
        // case for: export default from './a.js'. `default` is a keyword, rename it
        renameDefaultAddFileMetaProperties(t, path, filename, 'default')
      } else {
        // if there is `path.source`, the specifier is imported from another module. Then use its exportedName
        const specifierName = source ? exportedName : localName
        addFileMetaProperties(t, path, filename, specifierName)
      }
    }
  }
}

const insertNodeExportDefault = t => (path, state) => {
  const filename = getFilename(state)
  if (/(\.cache|\.docz).+/.test(filename)) return

  const declaration = get(path, 'node.declaration', {})

  if (/Function|Class|Identifier/.test(declaration.type)) {
    const name = declaration.name || get(declaration, 'id.name')
    addFileMetaProperties(t, path, filename, name)
    return
  }

  switch (declaration.type) {
    case 'ObjectExpression': {
      const { properties } = declaration
      for (property of properties) {
        const name = get(property, 'key.name')
        addFileMetaProperties(t, path, filename, name)
      }
      break
    }

    case 'ArrayExpression': {
      const { elements } = declaration
      for (element of elements) {
        const name = element.name
        addFileMetaProperties(t, path, filename, name)
      }
      break
    }
  }
}

module.exports = function({ types: t }) {
  const insertExport = insertNodeExport(t)
  const insertExportDefault = insertNodeExportDefault(t)

  return {
    visitor: {
      ExportNamedDeclaration: insertExport,
      ExportDefaultDeclaration: insertExportDefault,
    },
  }
}
