// Based on https://github.com/reactjs/react-docgen/issues/256#issuecomment-417352843

const { default: resolveHOC } = require('react-docgen/dist/utils/resolveHOC')
const {
  default: resolveToModule,
} = require('react-docgen/dist/utils/resolveToModule')
const { utils, resolver: reactDocgenResolver } = require('react-docgen')

type Todo = any

export const createStyledComponentResolvers = () => {
  const moduleName = 'styled-components'
  const isStyledExpression = (tagPath: Todo, t: Todo) =>
    (t.CallExpression.check(tagPath.node) &&
      tagPath.get('callee').node.name === 'styled') ||
    (t.MemberExpression.check(tagPath.node) &&
      tagPath.get('object').node.name === 'styled')

  function isStyledComponent(def: Todo, t: Todo) {
    if (
      !t.TaggedTemplateExpression.check(def.node) ||
      !isStyledExpression(def.get('tag'), t)
    ) {
      return false
    }
    const module = resolveToModule(def.get('tag'))
    return !!module && module === moduleName
  }

  const exportTagged = (path: Todo, t: Todo) => {
    const definitions: Todo[] = utils.resolveExportDeclaration(path, t)
    const components: Todo[] = []
    definitions.filter(Boolean).forEach(def => {
      let comp = def
      if (isStyledComponent(comp, t)) {
        components.push(comp)
      } else {
        comp = utils.resolveToValue(resolveHOC(comp))

        if (isStyledComponent(comp, t)) components.push(comp)
      }
    })
    return components
  }

  function findExportedStyledComponent(ast: Todo, recast: Todo) {
    const components: Todo[] = []
    const t = recast.types.namedTypes

    const visitor = (path: Todo) => {
      components.push(...exportTagged(path, t))
      return false
    }

    recast.visit(ast, {
      visitFunctionDeclaration: false,
      visitFunctionExpression: false,
      visitClassDeclaration: false,
      visitClassExpression: false,
      visitIfStatement: false,
      visitWithStatement: false,
      visitSwitchStatement: false,
      visitCatchCause: false,
      visitWhileStatement: false,
      visitDoWhileStatement: false,
      visitForStatement: false,
      visitForInStatement: false,

      visitExportDefaultDeclaration: visitor,
    })

    return components
  }

  function findAllExportedStyledComponents(ast: Todo, recast: Todo) {
    const components: Todo[] = []
    const t = recast.types.namedTypes

    const visitor = (path: Todo) => {
      components.push(...exportTagged(path, t))
      return false
    }

    recast.visit(ast, {
      visitFunctionDeclaration: false,
      visitFunctionExpression: false,
      visitClassDeclaration: false,
      visitClassExpression: false,
      visitIfStatement: false,
      visitWithStatement: false,
      visitSwitchStatement: false,
      visitCatchCause: false,
      visitWhileStatement: false,
      visitDoWhileStatement: false,
      visitForStatement: false,
      visitForInStatement: false,

      visitExportDeclaration: visitor,
      visitExportNamedDeclaration: visitor,
      visitExportDefaultDeclaration: visitor,
    })
    return components
  }

  function findAllStyledComponents(ast: Todo, recast: Todo) {
    const components: Todo[] = []
    const t = recast.types.namedTypes

    recast.visit(ast, {
      visitFunctionDeclaration: false,
      visitFunctionExpression: false,
      visitClassDeclaration: false,
      visitClassExpression: false,
      visitIfStatement: false,
      visitWithStatement: false,
      visitSwitchStatement: false,
      visitCatchCause: false,
      visitWhileStatement: false,
      visitDoWhileStatement: false,
      visitForStatement: false,
      visitForInStatement: false,

      visitTaggedTemplateExpression(path: Todo) {
        let comp = path
        if (isStyledComponent(path, t)) {
          components.push(path)
        } else {
          comp = utils.resolveToValue(resolveHOC(path))

          if (isStyledComponent(comp, t)) components.push(comp)
        }
        return false
      },
    })
    return components
  }

  return {
    findAllStyledComponents,
    findAllExportedStyledComponents,
    findExportedStyledComponent,
  }
}
export const resolver = (ast: Todo, recast: Todo) => [
  ...reactDocgenResolver.findAllExportedComponentDefinitions(ast, recast),
  ...createStyledComponentResolvers().findAllExportedStyledComponents(
    ast,
    recast
  ),
]
