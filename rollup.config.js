const eslint = require('@rollup/plugin-eslint')

module.exports = {
  input: 'src/js/script.js',
  output: {
    file: 'src/public/script.js',
    format: 'iife',
    compact: process.env.NODE_ENV === 'production',
  },
  plugins: [eslint()],
}
