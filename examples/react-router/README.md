# Basic Docz example

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-react-router --example react-router
# or
yarn create docz-app docz-app-react-router --example react-router
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/master | tar -xz --strip=2 docz-master/examples/react-router
mv react-router docz-react-router-example
cd docz-react-router-example
```

## Description

A simple docz demo with react router. Note the file in `src/gatsby-theme-docz/wrapper.js`. It wraps the page with a Router to allow the usage of things like `Route` and `Link`


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