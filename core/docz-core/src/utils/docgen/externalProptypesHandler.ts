// vendored from react-docgen-external-proptypes-handler
// which is not well maintained
// https://github.com/doczjs/docz/issues/727

const path = require('path')
const fs = require('fs')
const recast = require('recast')

/**
 * Re-using few private methods of react-docgen to avoid code duplication
 */
const isRequiredPropType = require('react-docgen/dist/utils/isRequiredPropType')
  .default
const setPropDescription = require('react-docgen/dist/utils/setPropDescription')
  .default
let babylon: any
try {
  const buildParser = require('react-docgen/dist/babelParser').default
  babylon = buildParser()
} catch (e) {
  /** DOCZ: special error message as people often encounter errors here because they misconfigure or lack a babel plugin */
  console.error('Error while initializing babel in docz: ', e)
  /** DOCZ: disabling this require because it no longer exists */
  throw new Error(e)
  // babylon = require('react-docgen/dist/babylon').default
}

const utils = require('react-docgen').utils
const types = recast.types.namedTypes
const HOP = Object.prototype.hasOwnProperty
const createObject = Object.create

function isPropTypesExpression(path: string) {
  const moduleName = utils.resolveToModule(path)

  if (moduleName) {
    return (
      utils.isReactModuleName(moduleName) || moduleName === 'ReactPropTypes'
    )
  }

  return false
}

/**
 * Amends the documentation object with propTypes information.
 * @method amendPropTypes
 * @param  {Object} documentation  documentation object
 * @param  {Object} path  node path reference of propTypes property
 */
function amendPropTypes(documentation: any, path: any) {
  if (!types.ObjectExpression.check(path.node)) {
    return
  }

  path.get('properties').each((propertyPath: any) => {
    let propDescriptor, valuePath, type, resolvedValuePath

    const nodeType = propertyPath.node.type

    if (nodeType === types.Property.name) {
      propDescriptor = documentation.getPropDescriptor(
        utils.getPropertyName(propertyPath)
      )
      valuePath = propertyPath.get('value')
      type = isPropTypesExpression(valuePath)
        ? utils.getPropType(valuePath)
        : {
            name: 'custom',
            raw: utils.printValue(valuePath),
          }
      if (type) {
        propDescriptor.type = type
        propDescriptor.required =
          type.name !== 'custom' && isRequiredPropType(valuePath)
      }
    } else if (nodeType === types.SpreadProperty.name) {
      resolvedValuePath = utils.resolveToValue(propertyPath.get('argument'))
      // normal object literal
      if (resolvedValuePath.node.type === types.ObjectExpression.name) {
        amendPropTypes(documentation, resolvedValuePath)
      }
    }

    if (types.Property.check(propertyPath.node)) {
      setPropDescription(documentation, propertyPath)
    }
  })
}

/**
 * Accepts absolute path of a source file and returns the file source as string.
 * @method getSrc
 * @param  {String} filePath  File path of the component
 * @return {String} Source code of the given file if file exist else returns empty
 */
function getSrc(filePath: string) {
  let src

  if (fs.existsSync(filePath)) {
    src = fs.readFileSync(filePath, 'utf-8')
  }

  return src
}

function getAST(src: string) {
  return recast.parse(src, {
    source: 'module',
    esprima: babylon,
  })
}

/**
 * Resolves propTypes source file path relative to current component,
 * which resolves only file extension of type .js or .jsx
 *
 * @method resolveFilePath
 * @param  {String} componentPath  Relative file path of the component
 * @param  {String} importedFilePath Relative file path of a dependent component
 * @return {String} Resolved file path if file exist else null
 */
function resolveFilePath(componentPath: string, importedFilePath: string) {
  const regEx = /\.(js|jsx)$/
  let srcPath = path.resolve(path.dirname(componentPath), importedFilePath)

  if (regEx.exec(srcPath)) {
    return srcPath
  } else {
    srcPath += fs.existsSync(`${srcPath}.js`) ? '.js' : '.jsx'
    return srcPath
  }
}

/**
 * Method which returns actual values from the AST node of type specifiers.
 *
 * @method getSpecifiersOfNode
 */
function getSpecifiersOfNode(specifiers: any) {
  const specifier: string[] = []

  specifiers.forEach((node: any) => {
    specifier.push(node.local.name)
  })

  return specifier
}

/**
 * Filters the list of identifier node values or node paths from a given AST.
 *
 * @method getIdentifiers
 * @param  {Object} ast Root AST node of a component
 * @return {Object} Which holds identifier relative file path as `key` and identifier name as `value`
 */
function getIdentifiers(ast: any) {
  const identifiers = createObject(null)

  recast.visit(ast, {
    visitVariableDeclarator(path: any) {
      const node = path.node
      const nodeType = node.init.type

      if (nodeType === types.Identifier.name) {
        if (identifiers[node.init.name]) {
          identifiers[node.init.name].push(node.init.name)
        } else {
          identifiers[node.init.name] = [node.init.name]
        }
      } else if (nodeType === types.Literal.name) {
        if (identifiers[node.id.name]) {
          identifiers[node.id.name].push(node.init.value)
        } else {
          identifiers[node.id.name] = [node.init.value]
        }
      } else if (nodeType === types.ArrayExpression.name) {
        if (identifiers[node.id.name]) {
          identifiers[node.id.name].push(node.init.elements)
        } else {
          identifiers[node.id.name] = node.init.elements
        }
      } else if (nodeType === types.ObjectExpression.name) {
        if (identifiers[node.id.name]) {
          identifiers[node.id.name].push({
            path,
            value: node.init.properties,
          })
        } else {
          identifiers[node.id.name] = {
            path,
            value: node.init.properties,
          }
        }
      }

      this.traverse(path)
    },
  })

  return identifiers
}

/**
 * Traverse through given AST and filters named and default export declarations.
 *
 * @method getExports
 * @param  {Object} ast Root AST node of a component
 * @return {Array} which holds list of named identifiers
 */
function getExports(ast: any) {
  const exports: any = []

  recast.visit(ast, {
    visitExportNamedDeclaration(path: any) {
      const node = path.node
      const specifiers = getSpecifiersOfNode(node.specifiers)
      const declarations = Object.keys(getIdentifiers(ast))

      exports.push(...new Set(specifiers.concat(declarations)))
      this.traverse(path)
    },
    visitExportDefaultDeclaration(path: any) {
      const node = path.node

      if (node.declaration.type === types.Identifier.name) {
        exports.push(node.declaration.name)
      }
      /* Commenting it for now, this might needed for further enhancements.
      else if (nodeType === types.Literal.name) {
        varDeclarators.push(node.init.value);
      } else if (nodeType === types.ArrayExpression.name) {
        computedPropNodes[node.id.name] = node.init.elements;
      }*/
      this.traverse(path)
    },
  })

  return exports
}

/**
 * Method to list all specifiers of es6 `import` of a given file(AST)
 *
 * @method getImports
 * @param  {Object} ast Root AST node of a component
 * @return {Object/Boolean} if Object: Holds import module name or file path as `key`
 *                          and identifier as `value`, else return false
 */
function getImports(ast: any) {
  const specifiers = createObject(null)

  recast.visit(ast, {
    visitImportDeclaration: (path: any) => {
      const name = path.node.source.value
      const specifier = getSpecifiersOfNode(path.node.specifiers)

      if (!specifiers[name]) {
        specifiers[name] = specifier
      } else {
        specifiers[name].push(...specifier)
      }

      return false
    },
  })

  return specifiers
}

/**
 * Method to resolve all dependent values(computed values, which are from external files).
 *
 * @method resolveImportedDependencies
 * @param  {Object} ast Root AST node of the component
 * @param  {Object} srcFilePath Absolute path of a dependent file
 * @return {Object} Holds export identifier as `key` and respective AST node path as value
 */
function resolveImportedDependencies(ast: any, srcFilePath: any) {
  const filteredItems = createObject(null)
  const importSpecifiers = getImports(ast)

  let identifiers, resolvedNodes

  if (importSpecifiers && Object.keys(importSpecifiers).length) {
    resolvedNodes = resolveDependencies(importSpecifiers, srcFilePath)
  }

  const exportSpecifiers = getExports(ast)

  if (exportSpecifiers && exportSpecifiers.length) {
    identifiers = getIdentifiers(ast)
  }

  if (resolvedNodes) {
    Object.assign(identifiers, ...resolvedNodes)
  }

  for (const identifier in identifiers) {
    if (
      HOP.call(identifiers, identifier) &&
      exportSpecifiers.indexOf(identifier) > -1
    ) {
      filteredItems[identifier] = identifiers[identifier]
    }
  }

  return filteredItems
}

/**
 * Method to resolve all the external dependencies of the component propTypes
 *
 * @method resolveDependencies
 * @param  {Array} filePaths List of files to resolve
 * @param  {String} componentPath Absolute path of the component in case `propTypes` are declared in a component file or
 *                  absolute path to the file where `propTypes` is declared.
 */
function resolveDependencies(filePaths: string[], componentPath: string) {
  const importedNodes = []

  for (const importedFilePath in filePaths) {
    if (HOP.call(filePaths, importedFilePath)) {
      const srcPath = resolveFilePath(componentPath, importedFilePath)

      if (!srcPath) {
        return
      }

      const src = getSrc(srcPath)

      if (src) {
        const ast = getAST(src)
        importedNodes.push(resolveImportedDependencies(ast, srcPath))
      }
    }
  }

  return importedNodes
}

/**
 * Method to filter computed props(which are declared out side of the component and used in propTypes object).
 *
 * @method filterSpecifiers
 * @param  {Object} specifiers  List which holds all the values of external dependencies
 * @return {Object} computedPropNames  List which holds all the computed values from `propTypes` property
 */
function filterSpecifiers(specifiers: any, computedPropNames: any) {
  const filteredSpecifiers = createObject(null)

  for (const cp in computedPropNames) {
    if (HOP.call(computedPropNames, cp)) {
      for (const sp in specifiers) {
        if (HOP.call(specifiers, sp) && specifiers[sp].indexOf(cp) > -1) {
          filteredSpecifiers[sp]
            ? filteredSpecifiers[sp].push(cp)
            : (filteredSpecifiers[sp] = [cp])
        }
      }
    }
  }

  return filteredSpecifiers
}

/**
 * Method to parse and get computed nodes from a document object
 *
 * @method getComputedPropValuesFromDoc
 * @param  {Object} doc  react-docgen document object
 * @return {Object/Boolean} Object with computed property identifer as `key` and AST node path as `value`,
 *                          If document object have any computed properties else return false.
 */

function getComputedPropValuesFromDoc(doc: any) {
  let flag
  const computedProps = createObject(null)
  const props = doc.toObject().props

  flag = false

  if (props) {
    for (const prop in props) {
      if (HOP.call(props, prop)) {
        const o = props[prop]
        if (o.type && o.type.name === 'enum' && o.type.computed) {
          flag = true
          computedProps[o.type.value] = o
        }
      }
    }
    return flag ? computedProps : false
  } else {
    return false
  }
}

/**
 * Method to update the document object computed values with actual values to generate doc for external dependent values.
 *
 * @method amendDocs
 * @param  {Object} doc  react-docgen document object
 * @param  {Object} path  AST node path of component `propTypes`
 * @param  {Object} props  list of actual values of computed properties
 */
function amendDocs(doc: any, path: any, props: any) {
  const propsToPatch = path.get('properties')

  function getComputedPropVal(name: string) {
    for (let i = 0; i < props.length; i++) {
      if (props[i][name]) {
        return props[i][name]
      }
    }
  }

  propsToPatch.each((propertyPath: string) => {
    const propDescriptor = doc.getPropDescriptor(
      utils.getPropertyName(propertyPath)
    )

    if (propDescriptor.type.name === 'enum' && propDescriptor.type.computed) {
      const oldVal = propDescriptor.type.value
      const newVal = getComputedPropVal(propDescriptor.type.value) || oldVal
      propDescriptor.type.value = newVal
      propDescriptor.type.computed = false
    }
  })
}

/**
 * Initializer of react-docgen custom handler.
 *
 * @method externalProptypesHandler
 * @param  {String} componentPath  Absolute path of the react component
 */
function externalProptypesHandler(componentPath: string) {
  return (doc: any, path: any) => {
    const root = path.scope.getGlobalScope().node
    let propTypesPath, propTypesFilePath, propTypesAST

    propTypesPath = utils.getMemberValuePath(path, 'propTypes')
    propTypesAST = root
    propTypesFilePath = componentPath

    if (!propTypesPath) {
      return
    }

    const propsNameIdentifier = propTypesPath.node.name
    propTypesPath = utils.resolveToValue(propTypesPath)

    if (!propTypesPath) {
      return
    }

    if (!types.ObjectExpression.check(propTypesPath.node)) {
      //First resolve dependencies against component path
      propTypesFilePath = resolveFilePath(
        componentPath,
        propTypesPath.node.source.value
      )
      const propTypesSrc = getSrc(propTypesFilePath)
      propTypesAST = getAST(propTypesSrc)
      const importedPropTypes = getIdentifiers(propTypesAST)[
        propsNameIdentifier
      ]

      if (!importedPropTypes) {
        return
      }

      propTypesPath = utils.resolveToValue(importedPropTypes.path)

      //updating doc object with external props
      amendPropTypes(doc, propTypesPath)
    }

    const computedPropNames = getComputedPropValuesFromDoc(doc)

    if (!computedPropNames) {
      return
    }

    const importSpecifiers = getImports(propTypesAST)

    if (!importSpecifiers) {
      return
    }

    const filteredProps = filterSpecifiers(importSpecifiers, computedPropNames)

    if (!Object.keys(filteredProps).length) {
      return
    }

    const resolvedImports = resolveDependencies(
      filteredProps,
      propTypesFilePath
    )

    if (resolvedImports && !resolvedImports.length) {
      return
    }

    amendDocs(doc, propTypesPath, resolvedImports)
  }
}

export default externalProptypesHandler
