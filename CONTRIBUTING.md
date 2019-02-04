# Contributing

Contributions, issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR! Also, you can ping me on [Twitter](https://twitter.com/pedronauck).

## Guidelines

If you are planning to submit a pull request, it's very important to follow these basic rules:

### Getting started

Fork the project on Github.

![](https://www.dropbox.com/s/jgh20dxksyjawgv/fork-project.png?raw=1)

Clone the project from the fork you have created previously at first step.

![](https://www.dropbox.com/s/nzmz154oav7imn5/clone-project.png?raw=1)

Then, check out the project:

`$ git clone https://github.com/`**your-github-user**`/docz.git`

## Setup

### Pre-requisites

- *Node:* `^9.0.0` or higher
- *Npm:* `6.0.0` or higher
- *Yarn: (optional)* `^1.7.0` or higher

### Install

Go to `docz` directory after checking out the repository:

```bash
$ cd docz
```

Then run the following commands to bootstrap all dependencies:

With `yarn`:
```bash
$ yarn install
$ yarn bs
```

With `npm`:
```bash
$ npm install
$ npm run bs
```

Finally, run the `packages` script to format, build and lint all packages:

With `yarn`:
```bash
$ yarn packages
```

With `npm`:
```bash
$ npm run packages
```

## Developing

### Project structure

docz follows the [Monorepo](https://en.wikipedia.org/wiki/Monorepo) design managed by [Lerna](https://github.com/lerna/lerna).

The are just two directories to care about if you would like to contribute:

- **Packages**: Host all docz source code.
- **Examples**: Host all available usage examples.

#### Packages

There are lots of [packages](https://github.com/pedronauck/docz/tree/master/packages) that are necessary to run docz, the most important packages that are important to care about:

#### **[docz-core](https://github.com/pedronauck/docz/tree/master/packages/docz-core)**
- This is the core of docz. All build algorithms, server process and parses belongs to here.
- If you break this package, probably you'll break all packages! Please, be carefull.
- All cli commands are built here and imported on `docz` package using `./bin` script.
- Do not create scripts that's running on browser here, only node scripts.

#### **[docz](https://github.com/pedronauck/docz/tree/master/packages/docz)**
- Main and top level package.
- Scripts that's running on browser belongs to this package
- Built-ins components are built here, most specifically on [this folder](https://github.com/pedronauck/docz/tree/master/packages/docz/src/components)
- This package shouldn't have any component style, just boilerplate and logic!

### Watching projects

To speed up your developing we recommended to run packages in a separated terminal process.

- Split your terminal and open each package directory in a separate window.
- Run `yarn dev` (or `npm run dev`) in each slice (or window) to watch tasks.

For example, to run some example from [examples](https://github.com/pedronauck/docz/tree/master/examples) directory.

![](https://cdn-std.dprcdn.net/files/acc_649651/MdH4FL)

In the above example you're watching `docz`, `docz-core` and `docz-theme-default` and also running `docz-example-basic`. So any modifications made to any of those packages will reflect in basic example on the fly!

### Creating plugins

If there are some plugin that you want to create, please contact me before to talk about the possibility to make this plugin official!

## Commit messages

Commit messages should follow the [commit message convention](https://conventionalcommits.org/) so, changelogs could be generated automatically by that. Commit messages are validated automatically upon commit. If you aren't familiar with the commit message convention, you can use yarn commit (or `npm run commit`) instead of git commit, which provides an interactive CLI for generating proper commit messages.

### Pull Requests

- All pull requests have to be send against `dev` branch.

- The **master branch** is a snapshot of the latest stable release. All development should be done in dedicated branch. **Do not submit PRs against the master branch**.

- If you are checking out from a feature or a topic different of `master` or `dev`, you have to merge back and push against the same feature.

- Work in the **src** folder of respective package and **DO NOT** checkin dist in the commits.

- It's OK - and a very nice thing - to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

### If adding a new feature:

- Make sure that [all examples](https://github.com/pedronauck/docz/tree/master/examples) are running as expected
- Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.


## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/2029172?v=4" width="60px;"/><br /><sub><b>Pedro Nauck</b></sub>](https://github.com/pedronauck)<br />[💻](https://github.com/pedronauck/docz/commits?author=pedronauck "Code") [📖](https://github.com/pedronauck/docz/commits?author=pedronauck "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Apedronauck "Bug reports") [👀](#review-pedronauck "Reviewed Pull Requests") | [<img src="https://avatars0.githubusercontent.com/u/3238901?s=460&v=4" width="60px;"/><br /><sub><b>Nicholas Eduardo</b></sub>](https://github.com/nicholasess)<br />[💻](https://github.com/pedronauck/docz/commits?author=nicholasess "Code") [📖](https://github.com/pedronauck/docz/commits?author=nicholasess "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Anicholasess "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/2096216?s=460&v=4" width="60px;"/><br /><sub><b>Marcelo Piva</b></sub>](https://github.com/mpivaa)<br />[💻](https://github.com/pedronauck/docz/commits?author=mpivaa "Code") [📖](https://github.com/pedronauck/docz/commits?author=mpivaa "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Ampivaa "Bug reports") |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
