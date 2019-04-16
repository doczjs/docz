const path = require('path')
const { default: template } = require('@babel/template')
const { get } = require('lodash')

const buildFileMeta = template(`
  if (typeof ID !== 'undefined' && ID && ID === Object(ID) && Object.isExtensible(ID)) {
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

const getFilename = state => {
  const filename = get(state, 'file.opts.filename')
  return filename && path.relative(process.cwd(), filename)
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
  } else if (specifiers) {
    for (specifier of specifiers) {
      let specifierName = get(specifier, 'local.name')
      specifierName =
        specifierName === 'default'
          ? get(specifier, 'exported.name')
          : specifierName

      addFileMetaProperties(t, path, filename, specifierName)
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
