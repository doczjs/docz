---
name: "\U0001F41B Bug report"
about: "Something is broken? \U0001F528"
---

## Bug Report

**Describe the bug**

A clear and concise description of what the bug is.

**To Reproduce**

Please try to build a small repo with a repro of your problem and provide a link to it.

Doing that allows more people to quickly help you.

If you can't provide a repo then provide clear steps describing how to reproduce the issue.

1. create-docz-app my-docz-app && cd my-docz-app
2. Change src/index.mdx to

```mdx
### Some mdx content

<IDontExist />
```

4. Run npm run docz dev
5. See error in browser

```shell
FOR BUGS: Insert debug trace
```

**Expected behavior**

A clear and concise description of what you expected to happen..

**Environment**

- docz version: [e.g. 2.0.0-rc.x or 1.3.2]
- OS: [e.g. OSX 10.13.4, Windows 10]
- Node/npm version: [e.g. Node 8/npm 5]

**Additional context/Screenshots**
Add any other context about the problem here. If applicable, add screenshots to help explain.
