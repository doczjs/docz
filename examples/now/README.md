# Docz Now Deployment example

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-now --example now
# or
yarn create docz-app docz-app-now --example now
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/main | tar -xz --strip=2 docz-main/examples/now
mv now docz-example-now
docz-example-now
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

## Deploy

```sh
yarn deploy
```

Note that by default `docz` generates the output site in `.docz/public` to change that add a `dest` field to your `doczrc.js` with the path you want to generate the code in.
