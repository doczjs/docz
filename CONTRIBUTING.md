# Contributing

Contributions, issues and feature requests are very welcome. 

If you are using this package and fixed a bug for yourself, please consider submitting a PR!

## Pre-requisites

- *Node:* `^9.0.0` or higher.
- *Npm:* `6.0.0` or higher.
- *Yarn:* `^1.7.0` or higher.

## Getting started

Clone the project from Github : 

```sh
git clone git@github.com:doczjs/docz.git
cd docz
```

Install dependencies : 

```sh
yarn
```

Setup development environment:

```sh
yarn dev
```

That's it you're ready to start contributing 👍!

### What does `yarn dev` do ?

1. Builds and watches all core docz packages.
2. Copies build output to local dev-env node_modules on every change.
3. Runs a docz app on `http://localhost:3000/` that listens to changes of docz packages' build output.

## Developing

### Project structure

docz follows the [Monorepo](https://en.wikipedia.org/wiki/Monorepo) design managed by [Lerna](https://github.com/lerna/lerna).

The are just two directories to care about if you would like to contribute:

- **Packages**: Host all docz source code.
- **Examples**: Host all available usage examples.

#### Packages

There are lots of [packages](https://github.com/pedronauck/docz/tree/master/core) that are necessary to run docz, the most important packages that are important to care about:

#### **[docz-core](https://github.com/pedronauck/docz/tree/master/core/docz-core)**
- This is the core of docz. All build algorithms, server process and parses belongs to here.
- If you break this package, probably you'll break all packages! Please, be careful.
- All CLI commands are built here and imported on `docz` package using `./bin` script.
- Do not create scripts that run on browser here, only node scripts.

#### **[docz](https://github.com/pedronauck/docz/tree/master/core/docz)**
- Main and top level package.
- Scripts that run on browser belongs to this package
- Built-ins components are built here, most specifically on [this folder](https://github.com/pedronauck/docz/tree/master/core/docz/src/components)
- This package shouldn't have any component style, just boilerplate and logic!

### Creating plugins

If there are some plugins that you want to create, please contact me before to talk about the possibility to make this plugin official!

## Commit messages

Commit messages should follow the [commit message convention](https://conventionalcommits.org/) so, changelogs could be generated automatically by that. Commit messages are validated automatically upon commit. If you aren't familiar with the commit message convention, you can use yarn commit (or `npm run commit`) instead of git commit, which provides an interactive CLI for generating proper commit messages.

### Pull Requests

- All pull requests have to be sent against `dev` branch.

- The **master branch** is a snapshot of the latest stable release. All development should be done in dedicated branch. **Do not submit PRs against the master branch**.

- If you are checking out from a feature or a topic different of `master` or `dev`, you have to merge back and push against the same feature.

- Work in the **src** folder of a respective package and **DO NOT** check `dist` in the commits.

- It's OK - and a very nice thing - to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

### If adding a new feature:

- Make sure that [all examples](https://github.com/pedronauck/docz/tree/master/examples) are running as expected
- Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.


## Contributors

This project exists thanks to all the people who contribute.

<a href="https://github.com/pedronauck/docz/graphs/contributors"><img src="https://opencollective.com/docz/contributors.svg?width=890&button=false" /></a>