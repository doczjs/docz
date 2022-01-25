# Docz with Custom Links Example

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-with-custom-links --example with-custom-links
# or
yarn create docz-app docz-app-with-custom-links --example with-custom-links
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/main | tar -xz --strip=2 docz-main/examples/with-custom-links
mv with-custom-links docz-with-custom-links-example
cd docz-with-custom-links-example
```

## Notes

A new component `a` was added and passed to the MDXProvider by shadowing `gatsby-theme-docz/components/index.js` and adding a custom implementation.

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
