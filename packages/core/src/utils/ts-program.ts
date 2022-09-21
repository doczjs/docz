import { template } from 'talt';
import ts from 'typescript';

export function walkNode(node: ts.Node, cb: (node: ts.Node) => void): void {
  cb(node);
  return node.forEachChild((child) => walkNode(child, cb));
}

export function setDisplayName(obj: string) {
  return template.statement(`${obj}.displayName = VALUE;`)({
    VALUE: ts.factory.createStringLiteral(obj),
  });
}

export function addImportStatement(method: string, moduleName: string) {
  return template.statement(`import { ${method} } from PKG;`)({
    PKG: ts.factory.createStringLiteral(moduleName),
  });
}

type AddMethodStatementOpts = {
  obj: string;
  method: string;
  assign?: boolean;
  params: string | Record<string, any>;
};

export function addMethodStatement(opts: AddMethodStatementOpts) {
  const { obj, method, assign, params } = opts;
  const PARAMS =
    typeof params === 'string'
      ? ts.factory.createStringLiteral(params)
      : template.expression(JSON.stringify(params))();

  const str = `${assign ? `${obj} = ` : ''}${method}(${obj}, PARAMS)`;
  return template.statement(str)({ PARAMS });
}

export function isNodeExported(node: ts.Node): boolean {
  try {
    return (
      (ts.getCombinedModifierFlags(node as ts.Declaration) &
        ts.ModifierFlags.Export) !==
        0 ||
      (!!node?.parent && node?.parent?.kind === ts.SyntaxKind.SourceFile)
    );
  } catch (error) {
    return false;
  }
}

export function createPrinter(sourceFile: ts.SourceFile) {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return (sourceNode: ts.Node) => {
    return printer.printNode(ts.EmitHint.Unspecified, sourceNode, sourceFile);
  };
}

export function isDeclarationNode(node: ts.Node): boolean {
  return (
    node.kind === ts.SyntaxKind.ExportSpecifier ||
    node.kind === ts.SyntaxKind.FunctionDeclaration ||
    node.kind === ts.SyntaxKind.FunctionExpression ||
    node.kind === ts.SyntaxKind.NamespaceExportDeclaration ||
    node.kind === ts.SyntaxKind.VariableDeclaration
  );
}

export function isExportDefault(node: ts.Node): boolean {
  const modifier = ts.ModifierFlags.ExportDefault;
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) & modifier) ===
    modifier
  );
}

export function hasReactComponent(
  node: ts.Node,
  print: ReturnType<typeof createPrinter>
) {
  const childs = [] as string[];
  walkNode(node, (child) => {
    childs.push(print(child));
  });
  return childs.some((child) => child.includes('_jsx'));
}
