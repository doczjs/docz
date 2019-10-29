# Custom base path docz example

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-custom-base-path --example custom-base-path
# or
yarn create docz-app docz-app-custom-base-path -- example custom-base-path
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/master | tar -xz --strip=2 docz-master/examples/custom-base-path
mv basic docz-custom-base-path-example
cd docz-custom-base-path-example
```

## Notes

`base` is added to doczrc and mapped to gatsby's `prefixPaths`

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
