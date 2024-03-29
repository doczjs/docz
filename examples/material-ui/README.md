# Docz example with material-ui

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-basic --example material-ui
# or
yarn create docz-app docz-app-basic --example material-ui
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/main | tar -xz --strip=2 docz-main/examples/material-ui
mv material-ui docz-material-ui-example
cd docz-material-ui-example
```

## Setup

In package.json :

```diff
- "//postinstall": "patch-package"
+ "postinstall": "patch-package"
```

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
