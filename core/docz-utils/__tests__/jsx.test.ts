import { removeTags } from '../src/jsx'

describe('removeTags', () => {
  test('removes outer JSX tag', () => {
    expect(
      removeTags(`
      <Playground>
        <div>Some text</div>
        <p>Other text</p>
      </Playground>
    `)
    ).toMatchInlineSnapshot(`
      "
              <div>Some text</div>
              <p>Other text</p>
            "
    `)
  })

  test('works when the closing tag is repeated in a comment', () => {
    expect(
      removeTags(`
      <Playground>
        {/* </Playground> */}
        <div>Some text</div>
      </Playground>
    `)
    ).toMatchInlineSnapshot(`
      "
              {/* </Playground> */}
              <div>Some text</div>
            "
    `)
  })
})
