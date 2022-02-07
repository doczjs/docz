# Docz Monorepo with Separate Docs Package Example

This example shows how to use docz in a monorepo package to document other peer packages.

The `Alert` component in `packages/alert` is documented by the `packages/docs` `docz` package.


## Using `create-docz-app`

```sh
npx create-docz-app docz-app-monorepo-separate-docs --example monorepo-separate-docs
# or
yarn create docz-app docz-app-monorepo-separate-docs --example monorepo-separate-docs
```

## Download

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/main | tar -xz --strip=2 docz-main/examples/monorepo-separate-docs
mv monorepo-separate-docs docz-monorepo-separate-docs-example
cd docz-monorepo-separate-docs-example
```

## Notes

In `docs/doczrc.js` :

- `docgenConfig.searchPath` is set to `packages/`
- The `filterComponents` function passed to docz allows the index.js file to be processed in `packages/alert/index.js`

## Setup

```sh
yarn # npm i
```

## Start developing

```sh
yarn dev # npm run dev
```

## Build

```sh
yarn build # npm run build
```

## Serve

```sh
yarn serve # npm run serve
```
