const ignorePatterns = require('./ignore-patterns')

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  ignorePatterns,
  rules: {
    'prettier/prettier': true,
    'block-no-empty': null,
  },
}
