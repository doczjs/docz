import template from 'babel-template';

const buildMetaInsertion = template(`
  FN_ID.__docz = {
    name: FN_NAME,
    filename: FILENAME
  };
`);

export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path, state) {
        const filename = state.file.opts.filename;
        const fnName = path.node.id.name;
        const newNode = buildMetaInsertion({
          FN_ID: t.identifier(fnName),
          FN_NAME: t.stringLiteral(fnName),
          FILENAME: t.stringLiteral(filename)
        });

        path.insertAfter(newNode);
      }
    }
  };
}
