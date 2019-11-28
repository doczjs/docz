# Gatsby Remark VSCode with Docz

[What is gatsby-remark-vscode ?](https://github.com/andrewbranch/gatsby-remark-vscode)

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-with-gatsby-remark-vscode
# or
yarn create docz-app docz-app-with-gatsby-remark-vscode
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/master | tar -xz --strip=2 docz-master/examples/with-gatsby-remark-vscode
mv with-gatsby-remark-vscode docz-with-gatsby-remark-vscode-example
cd docz-with-gatsby-remark-vscode-example
```

## Setup

```sh
yarn # npm i
```

## Run

```sh
yarn dev # npm run dev
```

## Build

```sh
yarn build # npm run build
```

## Serve built app

```sh
yarn serve # npm run serve
```

## Tutorial

There are two kinds of code blocks in docz.

The first is embedded in the markdown ( \`\`\`js \`\`\` ) and the other used with the Playground component (

```jsx
<Playground>
  {/* this code is editable by the user */}
  <SomeComponent />
</Playground>
```

).

For the one in the playground you won't be able to use gatsby-remark-vscode plugin because it's editable and rendered on the client.

For the second you should be able to add gatsby-remark-vscode :

1. Install gatsby-remark-vscode : `yarn add gatsby-remark-vscode`
2. In your `doczrc.js` file add :

```js
gatsbyRemarkPlugins: [
  {
    resolve: 'gatsby-remark-vscode',
    // OPTIONAL
    options: {},
  },
]
```

3. By now your site should be broken, you still need to tell docz not to try to render code blocks with prism (to leave it to gatsby-remark-vscode). To do that you will need to remove the pre and code components passed down to the MDXProvider by creating a file `src/gatsby-theme-docz/components/index.js` (original can be found [here](https://github.com/doczjs/docz/blob/master/core/gatsby-theme-docz/src/components/index.js)) and add to it :

```js
import * as headings from 'gatsby-theme-docz/src/components/Headings'
import { Layout } from 'gatsby-theme-docz/src/components/Layout'
import { Playground } from 'gatsby-theme-docz/src/components/Playground'
import { Props } from 'gatsby-theme-docz/src/components/Props'

export default {
  ...headings,
  playground: Playground,
  layout: Layout,
  props: Props,
}
```

Then run yarn docz dev and you should see your code block rendered using `gatsby-remark-vscode` 🎉 .
