import { Selector } from 'testcafe'
// import { getByText } from '@testing-library/testcafe'

const b: number = 2
fixture`Renders a valid app`.page`http://localhost:3000/`

test('Renders the right layout and nav', async t => {
  // Hacky selectors pending theme update with test ids or labels
  const main = await Selector('main')
  await t.expect(main.childNodeCount).eql(2)
  const header = await main.child(0)
  const layout = await main.child(1)
  await t.expect(header.find('a').count).eql(1)
  await t.expect(layout.find('a').count).gte(3)
})
