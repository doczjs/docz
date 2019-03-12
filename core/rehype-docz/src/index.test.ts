import mdx from '@mdx-js/mdx'
import remarkDocz from 'remark-docz'
import plugin from './'

const content = `
import { Playground } from 'docz'

<Playground>
  {() => {
    const foo = 'foo'

    return (
      <div>{foo}</div>
    )
  }}
</Playground>
`

test('adding custom props on <Playground>', async () => {
  const result = await mdx(content, {
    mdPlugins: [remarkDocz],
    hastPlugins: [[plugin, { root: __dirname }]],
  })

  expect(result).toMatch('__position={0}')
  expect(result).toMatch(
    `__code={'() => {\\n  const foo = \\'foo\\'\\n  return <div>{foo}</div>\\n}'}`
  )
  expect(result).toMatch(
    `__scope={{props: this ? this.props : props,Playground}}`
  )
})
