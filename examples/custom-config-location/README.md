# Docz with custom config location example

## Using `create-docz-app`

```sh
npx create-docz-app docz-app --example custom-config-location
# or
yarn create docz-app docz-app --example custom-config-location
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/master | tar -xz --strip=2 docz-master/examples/custom-config-location
mv custom-config-location docz-custom-config-location-example
cd docz-custom-config-location-example
```

## Setup

```sh
yarn # npm i
```

## Run

```sh
yarn docz dev --config src/doczrc.js # or yarn dev
```

## Build

```sh
yarn docz build --config src/doczrc.js # or yarn build
```

## Serve built app

```sh
yarn serve # npm run serve
```
