module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  transformIgnorePatterns: [
    "/node_modules/(?!unified|remark-parse|remark-frontmatter|remark-slug)/"
  ]
}
