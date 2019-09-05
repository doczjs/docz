# Docz Styled Components Example

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-styled-docz --example styled-docz
# or
yarn create docz-app docz-app-styled-docz --example styled-docz
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/master | tar -xz --strip=2 docz-master/examples/styled-docz
mv styled-docz docz-example-styled-docz
docz-example-styled-docz
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