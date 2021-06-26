const { src, dest, series, parallel, watch } = require('gulp')
const pug = require('gulp-pug')
const postcss = require('gulp-postcss')
const postcssPresetEnv = require('postcss-preset-env')
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes')
const postcssImport = require('postcss-import')
const del = require('del')
const rename = require('gulp-rename')
const browserSync = require('browser-sync').create()
const cssnano = require('cssnano')
const stylelint = require('stylelint')
const reporter = require('postcss-reporter')
const htmlhint = require('gulp-htmlhint')
const eslint = require('gulp-eslint')

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

function basePug() {
  return src(`${paths.src}/pages/**/*.pug`)
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter())
}

function lintPug() {
  return basePug()
}

function buildPug() {
  return basePug().pipe(dest(paths.dist))
}

function baseCSS() {
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
    cssnano({ autoprefixer: false }),
  ]

  return src(`${paths.src}/pcss/styles.pcss`, {
    sourcemaps: true,
  }).pipe(postcss(plugins))
}

function lintCSS() {
  return baseCSS()
}

function buildCSS() {
  return baseCSS()
    .pipe(
      rename({
        extname: '.css',
      })
    )
    .pipe(dest(paths.dist, { sourcemaps: '.' }))
    .pipe(browserSync.stream())
}

function baseJS() {
  return src(`${paths.src}/public/script.js`).pipe(eslint())
}

function lintJS() {
  return baseJS().pipe(eslint.failAfterError())
}

function buildJS() {
  return baseJS().pipe(dest(paths.dist))
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
  watch(`${paths.src}/public/script.js`, series(buildJS, reload))
  cb()
}

const lint = parallel(lintPug, lintCSS, lintJS)
const build = series(clear, copy, parallel(buildPug, buildCSS, buildJS))
const dev = series(build, parallel(browser, watchFiles))

exports.lint = lint
exports.build = build
exports.dev = dev
