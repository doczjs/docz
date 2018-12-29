import { utils } from 'react-docgen'
import * as recast from 'recast'

const { getNameOrValue, resolveFunctionDefinitionToReturnValue } = utils
const {
  types: { namedTypes: types },
} = recast

export default function actualNameHandler(documentation: any, path: any): any {
  // Function and class declarations need special treatment. The name of the
  // function / class is the displayName
  if (
    types.ClassDeclaration.check(path.node) ||
    types.FunctionDeclaration.check(path.node)
  ) {
    documentation.set('actualName', getNameOrValue(path.get('id')))
  } else if (
    types.ArrowFunctionExpression.check(path.node) ||
    types.FunctionExpression.check(path.node)
  ) {
    if (types.VariableDeclarator.check(path.parentPath.node)) {
      documentation.set('actualName', getNameOrValue(path.parentPath.get('id')))
    } else if (types.AssignmentExpression.check(path.parentPath.node)) {
      documentation.set(
        'actualName',
        getNameOrValue(path.parentPath.get('left'))
      )
    }
  } else if (
    // React.createClass() or createReactClass()
    types.CallExpression.check(path.parentPath.node) &&
    types.VariableDeclarator.check(path.parentPath.parentPath.parentPath.node)
  ) {
    documentation.set(
      'actualName',
      getNameOrValue(path.parentPath.parentPath.parentPath.get('id'))
    )
  } else {
    // Could not find an actual name
    documentation.set('actualName', '')
  }
  return

  // If display name is defined as a getter we get a function expression as
  // value. In that case we try to determine the value from the return
  // statement.
  let displayNamePath
  if (types.FunctionExpression.check(displayNamePath.node)) {
    displayNamePath = resolveFunctionDefinitionToReturnValue(displayNamePath)
  }
  if (!displayNamePath || !types.Literal.check(displayNamePath.node)) return
  documentation.set('actualName', displayNamePath.node.value)
}
