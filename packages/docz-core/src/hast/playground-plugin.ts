import visit from 'unist-util-visit'
import prism from 'node-prismjs'
import nodeToString from 'hast-util-to-string'

const hasOpenTag = (node: any) => /^\<Playground/.test(node.value)

export const playgroundHast = () => (tree: any, file: any) => {
  visit(tree, 'jsx', visitor)

  function visitor(node: any, idx: any, parent: any): void {
    if (!hasOpenTag(node)) return

    const code = nodeToString(node)
    const html = prism.highlight(code, prism.languages.jsx)

    const codeComponent = `(
      <pre className="react-prism language-jsx">
        <code dangerouslySetInnerHTML={{ __html: \`${html}\` }} />
      </pre>
    )`

    node.value = node.value
      .replace(/^\<Playground/, `<Playground __code={${codeComponent}}`)
      .replace(/^\<Playground/, '<Playground components={components}')
  }
}
