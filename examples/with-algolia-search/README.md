# Docz with Algolia Search example

- [Using `create-docz-app`](#using-create-docz-app)
- [Download manually](#download-manually)
- [Setup](#setup)
  - [Add your Algolia Credentials](#add-your-algolia-credentials)
- [Send Data Parsed from your MDX Files to Algolia](#send-data-parsed-from-your-mdx-files-to-algolia)
- [Run](#run)
- [Build](#build)
- [Serve built app](#serve-built-app)
- [Credits](#credits)

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-with-algolia-search --example with-algolia-search
# or
yarn create docz-app docz-app-with-algolia-search --example with-algolia-search
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/master | tar -xz --strip=2 docz-master/examples/with-algolia-search
mv with-algolia-search docz-with-algolia-search-example
cd docz-with-algolia-search-example
```

## Setup

### Add your Algolia Credentials

Start by adding your Algolia credentials to a .env file, which you shouldn't commit.
If you track this in your file, and especially if the site is open source, you will leak your admin API key. This would mean anyone is able to change anything on your Algolia index.

Rename .env.example to .env and fill in the values with your algolia keys that you can find here : https://www.algolia.com/api-keys

```sh
# //  .env.example
# rename this file to .env and supply the values listed below
# warning: variables prexifed with GATSBY_ will be made available to client-side code
# be careful not to expose sensitive data (in this case your Algolia admin key ALGOLIA_ADMIN_KEY)

GATSBY_ALGOLIA_INDEX_NAME=insertValue
GATSBY_ALGOLIA_APP_ID=insertValue
GATSBY_ALGOLIA_SEARCH_KEY=insertValue
ALGOLIA_ADMIN_KEY=insertValue
```

```sh
yarn # npm i
```

## Send Data Parsed from your MDX Files to Algolia

Data is sent to Algolia only when you build your site.

Run the build command

```sh
yarn build
```

Now, if you open your algolia dashboard you should see a new index with the name you provided for `ALGOLIA_INDEX_NAME` in your .env file

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

## Credits

The excellent tutorial on integrating Algolia with Gatsby : https://www.gatsbyjs.org/docs/adding-search-with-algolia/ was a huge help in preparing this example. The UI components are heavily inspired by the ones provided there. If you want to learn more about integrating Algolia make sure to read it !
