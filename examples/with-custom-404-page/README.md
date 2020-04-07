# Docz with custom 404 page example

To add a custom 404 pages, add a `404.js` file in `src/pages/404.js`.

You can use a different directory instead of `src` by pointing the themesDir config to another folder.

In development mode Gatsby shows you a custom 404 to help you debug. To preview your own build the app, serve it and visit a URL that doesn't exist.

```sh
npm run docz build && npm run docz serve
# then visit http://localhost:3000/i-do-not-exist
```

## Using `create-docz-app`

```sh
npx create-docz-app --example with-custom-404-page docz-app-basic
# or
yarn create docz-app docz-app-basic --example with-custom-404-page
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/master | tar -xz --strip=2 docz-master/examples/with-custom-404-page
mv with-custom-404-page docz-with-custom-404-page-example
cd docz-with-custom-404-page-example
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
