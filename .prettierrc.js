module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: ['*.js', '*.ts'],
      options: {
        printWidth: 80,
        semi: true,
        tabWidth: 2,
        useTabs: false,
        singleQuote: true,
        bracketSpacing: true,
      },
    },
    {
      files: ['*.js', '*.ts', '*.json'],
      options: {
        useTabs: false,
      },
    },
    {
      files: '*.md',
      options: {
        useTabs: false,
      },
    },
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
