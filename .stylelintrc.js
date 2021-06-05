const ignoreFiles = require('./ignore-patterns')

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  ignoreFiles,
  rules: {
    'prettier/prettier': true,
    'block-no-empty': null,
    'no-descending-specificity': null,
    'selector-class-pattern': '^(?:c|is|u)-(?:[a-z0-9-]+?_)?[a-z0-9-]+$',
  },
}
