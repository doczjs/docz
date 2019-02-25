# Migration Guide

The [v1 release](https://github.com/pedronauck/docz/pull/656) was one of our big releases and a lot of breaking changes was introduced. So, there's few apis that changed and you need to update your code if you're coming from previous versions. It's not a big deal, but you need to follow this guide in order to get Docz running properly on your project.

## Spectrum instead of Discord

Together with the v1, now you're moving from our old discord server to the [new Spectrum](https://spectrum.chat/docz).

### You're our guess, please, enter on [our community](https://spectrum.chat/docz) 🙏🏻

## Update React to use Hooks

We made a [huge improvement](https://github.com/pedronauck/docz/commit/f57f987df0536b3b65a26f1b0e8a8f8f00d63800) on docz using the new react hooks. So, the biggest requirement is that you need `react` and `react-dom` with the version `>= 16.8.0`, because that's the version that has hooks released and stable. So, just update your React version, it's fully retro compatible.

## Removing render props data components

In the oldest version of docz, we're using render props as data components in order to get data from the docz database and use it on themes. Now, all this render props became a hook. This is a huge improvement, since it's so easier to use them.

#### `<Docs>` now is `useDocs()`

With this hook you can get all mdx entries used on docz.

```jsx
// old
<Docs>
  {({ docs, menus }) => /* do something */}
</Docs>

// new
const docs = useDocs()
```

#### `<ThemeConfig>` now is `useConfig()`

Get information about the configuration of your project.

```jsx
// old
<ThemeConfig>
  {(config) => /* do something */}
</ThemeConfig>

// new
const config = useConfig()
```

#### New `useMenus()`

If you want just the menu information you can use this hook.

```js
const menus = useMenus({ query: 'some search' })
```

#### New `useComponents()`

Get all components map passed into `<ComponentsProvider>`

```jsx
const components = useComponents()
```

## Removing order deprecated field

Since [v0.12.4](https://github.com/pedronauck/docz/releases/tag/v0.12.4) we launched `menu` property to create and sort your menu, and the `ordering` frontmatter field was deprecated. So, now we're removing this property. If you wanna see more information about the `menu` order property, you can take a look at the `Ordering` session on our website.

## Use `<Props>` instead of `<PropsTable>`

Another change that we've made in this version is that now we have a `<Props>` component instead of `<PropsTable>`. So, the `<PropsTable>` component doesn't exist anymore and the new one don't have more a table format, instead of that, it's just a list with the props and their values. So, it became more simple and flexible to be stylized.

#### The old way

```jsx
import { PropsTable } from 'docz'
import MyComponent from './my-components'

<PropsTable of={MyComponent} />
```

### The new way

```jsx
import { Props } from 'docz'
import MyComponent from './my-components'

<Props of={MyComponent} />
```

## Remove hash router support

In the newest version of docz, because of some performance and bundle issues, now we are using `@reach/router` instead of `react-router`. So, how `@reach/router` doesn't have a official support for hash router yet and you have a lot of good free services to host your site instead of use Github pages - and get all benefits of browser history, of course - we decided to deprecated the hash router support.

## Creating and using docz themes

The process to create themes for docz it's very similar, there's not a big changes here, but you need to know about few changes that we made.

- The first one, is you don't have `DocPreview` anymore, instead of that, was introduced `ComponentsProvider` component.
- The second one, is the `render` field passed in the components mapper now is `playground`.
- And the last one, is now you need to pass a children for your theme.

#### The old way

```jsx
import React from 'react'
import { theme, DocPreview } from 'docz'
import * as components from './my-components'

const Theme = () => (
  <DocPreview
    components={{
      page: components.Page,
      notFound: components.NotFound,
      render: components.Render,
      props: components.Props,
      h1: components.H1,
      h2: components.H2,
      h3: components.H3,
      h4: components.H4,
      h5: components.H5,
      h6: components.H6,
      ul: components.List,
      loading: components.Loading,
      table: components.Table,
      pre: components.Pre,
      inlineCode: components.Code,
    }}
  />
)

const themeConfig = {
  /* your theme config */
}
export default theme(themeConfig)(Theme)
```

#### The new way

```jsx
import React from 'react'
import { theme, ComponentsProvider } from 'docz'
import * as components from './my-components'

const map = {
  page: components.Page,
  notFound: components.NotFound,
  playground: components.Playground,
  h1: components.H1,
  h2: components.H2,
  h3: components.H3,
  h4: components.H4,
  h5: components.H5,
  h6: components.H6,
  ul: components.List,
  loading: components.Loading,
  table: components.Table,
  pre: components.Pre,
  inlineCode: components.Code,
}

const Theme = ({ children }) => (
  <ComponentsProvider components={map}>{children}</ComponentsProvider>
)

const themeConfig = {
  /* your theme config */
}
export default theme(themeConfig)(Theme)
```
