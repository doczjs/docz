export default {
  docgenConfig: {
    searchPath: '../',
  },
  filterComponents: files => {
    return files.filter(
      filepath =>
        /\/[A-Z]\w*\.(js|jsx|ts|tsx)$/.test(filepath) ||
        filepath.includes('/alert/index.js')
    )
  },
}
