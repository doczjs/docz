import template from '@babel/template'

const buildMetaInsertion = template(`
  ID.__docz = {
    name: NAME,
    filename: FILENAME
  };
`)

const insertMeta = (t: any) => (path: any, state: any): any => {
  const filename = state.file.opts.filename
  const name = path.node.id.name
  const newNode = buildMetaInsertion({
    ID: t.identifier(name),
    NAME: t.stringLiteral(name),
    FILENAME: t.stringLiteral(filename),
  })

  path.insertAfter(newNode)
}

export default function({ types: t }: any): any {
  return {
    visitor: {
      FunctionDeclaration: insertMeta(t),
      ClassDeclaration: insertMeta(t),
    },
  }
}
