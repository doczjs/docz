# Docz With Env Variables Example

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-with-env-variables
# or
yarn create docz-app docz-app-with-env-variables
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/main | tar -xz --strip=2 docz-main/examples/with-env-variables
mv with-env-variables docz-with-env-variables-example
cd docz-with-env-variables-example
```

## Notes

Environment variables are defined in `gatsby-node.js` by changing the webpack config (process.env.FOO, process.env.PROD) or in .env.* and then imported using `dotenv` in `gatsby-config.js` (process.env.GATSBY_API_URL).

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
