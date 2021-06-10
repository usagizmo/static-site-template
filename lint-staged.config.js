const prettier = require('prettier')
const prettierSupportedExtensions = prettier
  .getSupportInfo()
  .languages.map(({ extensions }) => extensions)
  .flat()
  .map((extension) => extension.slice(1))
const q = (a) => `"${a}"`
const prettierGlob = `**/*.{${prettierSupportedExtensions.join(',')}}`
const toRelative = (filename) => `.${filename.replace(__dirname, '')}`

module.exports = {
  '**/*.html': (filenames) =>
    filenames.flatMap((filename) => [
      `prettier --write ${q(filename)}`,
      `htmlhint ${q(filename)}`,
      `html-validate ${q(toRelative(filename))}`,
    ]),
  '**/*.js': (filenames) => filenames.map((filename) => `eslint --cache --fix ${q(filename)}`),
  '**/*.css': (filenames) => filenames.map((filename) => `stylelint --cache --fix ${q(filename)}`),
  [prettierGlob]: (filenames) => `prettier --write ${filenames.map(q).join(' ')}`,
}
