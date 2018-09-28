# Contributing

Contributions, issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR! Also you can ping me at [Twitter](https://twitter.com/pedronauck)

## Guidelines

If you are planning to submit a pull request, it's very important follow these basic rules:

### Commit messages

Commit messages should follow the [commit message convention](https://conventionalcommits.org/) so that changelogs can be automatically generated. Commit messages will be automatically validated upon commit. If you are not familiar with the commit message convention, you can use `yarn commit` instead of `git commit`, which provides an interactive CLI for generating proper commit messages.

### General guidelines

- The master branch is basically just a snapshot of the latest stable release. All development should be done in dedicated branch. **Do not submit PRs against the master branch.**
- Checkout a topic branch from the relevant branch, e.g. `dev`, and merge back against that branch.
- Work in the **src** folder of respective package and **DO NOT** checkin dist in the commits.
- It's OK - and a very nice thing - to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

### If adding a new feature:

- Make sure that [all examples](https://github.com/pedronauck/docz/tree/master/examples) are running as expected
- Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.

## Setup

### Pre-requisites

- *Node:* `^9.0.0`
- *Yarn:* `^1.7.0`

### Install

Check out the code and go into the docz directory:

```bash
git clone https://github.com/pedronauck/docz.git
cd docz
```

Then run yarn install and bootstrap all packages:

```bash
$ yarn install
$ yarn bs
```

After that, just run `packages` script to format, build and lint all packages:

```bash
$ yarn packages
```

## Developing

There's just few things that you need to know to start developing on docz

### Project structure

There's a lot of [packages](https://github.com/pedronauck/docz/tree/master/packages) that are necessary to run docz, but basically has just two that you need to know more about:

#### **[docz-core](https://github.com/pedronauck/docz/tree/master/packages/docz)**
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

To speed up your develop process:
- Split your terminal and open each package directory in a separate window.
- Run `yarn dev` in each window to run the watch tasks. For example, in this [examples](https://github.com/pedronauck/docz/tree/master/examples) directory.

![](https://cdn-std.dprcdn.net/files/acc_649651/MdH4FL)

In the above example you're watching `docz`, `docz-core` and `docz-theme-default` and also running `docz-example-basic`. So any modifications made to any of those packages will reflect in basic example on the fly!

### Creating plugins

If there are some plugin that you want to create, please contact me before to talk about the possibility to make this plugin official!

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/2029172?v=4" width="60px;"/><br /><sub><b>Pedro Nauck</b></sub>](https://github.com/pedronauck)<br />[💻](https://github.com/pedronauck/docz/commits?author=pedronauck "Code") [📖](https://github.com/pedronauck/docz/commits?author=pedronauck "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Apedronauck "Bug reports") [👀](#review-pedronauck "Reviewed Pull Requests") | [<img src="https://avatars0.githubusercontent.com/u/3238901?s=460&v=4" width="60px;"/><br /><sub><b>Nicholas Eduardo</b></sub>](https://github.com/nicholasess)<br />[💻](https://github.com/pedronauck/docz/commits?author=nicholasess "Code") [📖](https://github.com/pedronauck/docz/commits?author=nicholasess "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Anicholasess "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/2096216?s=460&v=4" width="60px;"/><br /><sub><b>Marcelo Piva</b></sub>](https://github.com/mpivaa)<br />[💻](https://github.com/pedronauck/docz/commits?author=mpivaa "Code") [📖](https://github.com/pedronauck/docz/commits?author=mpivaa "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Ampivaa "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/13947203?v=4" width="60px;"/><br /><sub><b>Guilherme Jabur</b></sub>](https://github.com/jaburcodes)<br />[💻](https://github.com/pedronauck/docz/commits?author=jaburcodes "Code") [📖](https://github.com/pedronauck/docz/commits?author=jaburcodes "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Ajaburcodes "Bug reports") |
| :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
