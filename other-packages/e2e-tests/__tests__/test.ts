import { Selector } from 'testcafe'

const getByTestId = async (testId: string) => {
  return await Selector(`[data-testid=${testId}]`)
}

fixture`Renders a valid app`.page`http://localhost:3000/`

test('Renders the right layout and nav', async t => {
  const layout = await getByTestId('layout')
  await t.expect(layout.exists).eql(true)
  const header = await getByTestId('header')
  await t.expect(header.exists).eql(true)
  const sidebar = await getByTestId('sidebar')
  await t.expect(sidebar.exists).eql(true)
  const logo = await getByTestId('logo')
  await t.expect(logo.exists).eql(true)
  const navGroup = await getByTestId('nav-group')
  await t.expect(navGroup.exists).eql(true)

  await t.navigateTo('/src-components-alert')

  const playground = await getByTestId('playground')
  await t.expect(playground.count).eql(2)

  const livePreview = await getByTestId('live-preview')
  await t.expect(livePreview.count).eql(2)

  const liveEditor = await getByTestId('live-editor')
  await t.expect(liveEditor.count).eql(2)
})

test('Render props', async t => {
  await t.navigateTo('/src-components-alert')
  const prop = await getByTestId('prop')
  await t.expect(prop.exists).eql(true)
  await t.expect(prop.count).eql(1)
})
