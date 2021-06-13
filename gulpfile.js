const { src, dest, series, parallel, watch } = require('gulp')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const pug = require('gulp-pug')
const postcss = require('gulp-postcss')
const postcssPresetEnv = require('postcss-preset-env')
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes')
const postcssImport = require('postcss-import')
const del = require('del')
const rename = require('gulp-rename')
const browserSync = require('browser-sync').create()
const cssnano = require('cssnano')
const mqpacker = require('css-mqpacker')
const stylelint = require('stylelint')
const reporter = require('postcss-reporter')
const htmlhint = require('gulp-htmlhint')
const eslint = require('gulp-eslint')

const errorHandler = {
  errorHandler: notify.onError('Error: <%= error.message %>'),
}

const paths = {
  dist: './dist',
  src: './src',
}

function clear() {
  return del(paths.dist)
}

function copy() {
  return src(`${paths.src}/public/**/*`).pipe(dest(paths.dist))
}

function buildPug() {
  return src(`${paths.src}/pages/**/*.pug`)
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter())
    .pipe(dest(paths.dist))
}

function buildCSS() {
  const plugins = [
    postcssFlexbugsFixes(),
    postcssImport({
      plugins: [stylelint()],
    }),
    postcssPresetEnv({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'nesting-rules': true,
      },
    }),
    reporter({ clearReportedMessages: true }),
    mqpacker(),
    cssnano({ autoprefixer: false }),
  ]

  return src(`${paths.src}/pcss/styles.pcss`, {
    sourcemaps: true,
  })
    .pipe(postcss(plugins))
    .pipe(
      rename({
        extname: '.css',
      })
    )
    .pipe(dest(paths.dist, { sourcemaps: '.' }))
    .pipe(browserSync.stream())
}

function buildJS() {
  return src(`${paths.src}/public/script.js`).pipe(eslint()).pipe(dest(paths.dist))
}

function browser(cb) {
  browserSync.init({
    server: paths.dist,
  })
  cb()
}

function watchFiles(cb) {
  function reload(cb2) {
    browserSync.reload()
    cb2()
  }

  watch(`${paths.src}/**/*.pug`, series(buildPug, reload))
  watch(`${paths.src}/**/*.pcss`, series(buildCSS))
  watch(`${paths.src}/public/script.js`, series(buildJS))
  cb()
}

const build = series(clear, copy, parallel(buildPug, buildCSS, buildJS))
const dev = series(build, parallel(browser, watchFiles))

exports.build = build
exports.dev = dev
