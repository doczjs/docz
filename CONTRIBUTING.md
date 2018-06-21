# Contributing

Contributions, issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR! Also you can ping me at [Twitter](https://twitter.com/pedronauck)

## Guidelines

If you will develop some pull request, it's very important follow these basic rules:

### Commit messages

Commit messages should follow the [commit message convention](https://conventionalcommits.org/) so that changelogs can be automatically generated. Commit messages will be automatically validated upon commit. If you are not familiar with the commit message convention, you can use `yarn commit` instead of `git commit`, which provides an interactive CLI for generating proper commit messages.

### General guidelines

- The master branch is basically just a snapshot of the latest stable release. All development should be done in dedicated branch. **Do not submit PRs against the master branch.**
- Checkout a topic branch from the relevant branch, e.g. `dev`, and merge back against that branch.
- Work in the **src** folder of respective package and **DO NOT** checkin dist in the commits.
- It's OK - and a very nice thing - to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

### If adding new feature:

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

There just few things that you need to know if you want to start to develop on docz

### Project structure

There's a lot of packages on [packages](https://github.com/pedronauck/docz/tree/master/packages) folder that are so necessary to docz run, but basically has just two packages that you need to know more about:

#### **[docz-core](https://github.com/pedronauck/docz/tree/master/packages/docz)**
- This is the core of docz, all build process, server process and parses belongs to here!
- If you break this package, you'll break all packages! Please, be carefull.
- All cli commands are built here and imported on `docz` package on `./bin` script
- Do not create and use not relative to client here, just node scripts!

#### **[docz](https://github.com/pedronauck/docz/tree/master/packages/docz)**
- Main and top level package.
- It's not have any node script unless the `./bin` script using `docz-core` and `yargs` to build the cli tool.
- Just built-ins components are built in this package
- This package shouldn't have any component style, just logic!

### Watching projects

To speed up your develop process, you can split your terminal by open the packages that you need to develop and run `yarn dev` in each window. This will build the package in dev mode. So, after that, you can use any splitted window to run `yarn dev` too in some example package to see it in action, like that:

![](https://cdn-std.dprcdn.net/files/acc_649651/MdH4FL)

Above you watching `docz`, `docz-core` and `docz-theme-default` and running `docz-example-basic`. So, any modification that is made on any package will reflect on basic example on the fly!

### Creating plugins

If you see that has some plugin that you can create and don't have this plugin on `packages/` folder, please contact-me before to we talk about make this plugin official!

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/2029172?v=4" width="60px;"/><br /><sub><b>Pedro Nauck</b></sub>](https://github.com/pedronauck)<br />[💬](#question-pedronauck "Answering Questions") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Apedronauck "Bug reports") [💻](https://github.com/pedronauck/docz/commits?author=pedronauck "Code") [📖](https://github.com/pedronauck/docz/commits?author=pedronauck "Documentation") [🤔](#ideas-pedronauck "Ideas, Planning, & Feedback") [🔌](#plugin-pedronauck "Plugin/utility libraries") [👀](#review-pedronauck "Reviewed Pull Requests") [⚠️](https://github.com/pedronauck/docz/commits?author=pedronauck "Tests") | [<img src="https://avatars2.githubusercontent.com/u/3277185?v=4" width="60px;"/><br /><sub><b>Renato Ribeiro</b></sub>](http://twitter.com/renatorib_)<br />[💻](https://github.com/pedronauck/docz/commits?author=renatorib "Code") [📖](https://github.com/pedronauck/docz/commits?author=renatorib "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Arenatorib "Bug reports") | [<img src="https://avatars3.githubusercontent.com/u/5435657?v=4" width="60px;"/><br /><sub><b>Marcelo Formentão</b></sub>](https://github.com/marceloavf)<br />[💻](https://github.com/pedronauck/docz/commits?author=marceloavf "Code") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Amarceloavf "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/4456346?v=4" width="60px;"/><br /><sub><b>Martyn Rushton</b></sub>](http://swapnull.co.uk)<br />[💻](https://github.com/pedronauck/docz/commits?author=Swapnull "Code") | [<img src="https://avatars3.githubusercontent.com/u/11514928?v=4" width="60px;"/><br /><sub><b>Joseph Thomas</b></sub>](https://www.good-idea.studio)<br />[💻](https://github.com/pedronauck/docz/commits?author=good-idea "Code") |
| :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
