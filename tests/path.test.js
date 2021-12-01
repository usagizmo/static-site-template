const { readFile, access } = require('fs').promises
const { dirname, join, basename } = require('path')
const execSync = require('child_process').execSync
const { allowedPathList, publicDir, imageExtensions } = require('./config')

const findHtml = execSync(`find ${publicDir} -type f -name "*.html"`)
const htmlFilePaths = findHtml.toString().trim().split('\n')

const findImagesOption = imageExtensions.map((ext) => `-name "*.${ext}"`).join(' -o ')
const findImages = execSync(`find ${publicDir} -type f ${findImagesOption}`)
const imageFilePaths = findImages.toString().trim().split('\n')

// ref: https://regexper.com/#%5E%28%3F%3A%28%3F%3A%23%5B%5E%3F%23%5D*%29%7C%28%3F%3A%28%3F%3A%5C.%7C%5C.%5C.%29%5C%2F%28%3F%3A%5C.%5C.%5C%2F%29*%29%28%3F%3A%5B%5Cw%5D%5B%5E%22%5D%2B%7C%28%3F%3A%5C%3F%5B%5E%3F%23%5D%2B%29%3F%28%3F%3A%23%5B%5E%3F%23%5D*%29%3F%29%3F%29%24
const validPathPattern =
  /^(?:(?:#[^?#]*)|(?:(?:\.|\.\.)\/(?:\.\.\/)*)(?:[\w][^"]+|(?:\?[^?#]+)?(?:#[^?#]*)?)?)$/
const isValidPath = (path) => validPathPattern.test(path)

describe('Path validation:', () => {
  test.each([
    ['./', true],
    ['../', true],
    ['#', true],
    ['#hash', true],
    ['./#', true],
    ['./#hash', true],
    ['./?param=value', true],
    ['./index.html', true],
    ['../index.html', true],
    ['../dir/index.html', true],
    ['/', false],
    ['.//', false],
    ['..//', false],
    ['.../', false],
    ['?', false],
    ['?param=value', false],
    ['./?', false],
    ['index.html', false],
    ['.././index.html', false],
  ])('`%s` is %s', (path, expected) => {
    expect(isValidPath(path)).toBe(expected)
  })
})

const relativeUrlToFilePath = (path) => {
  if (!path) return ''

  const plain = path.split('#')[0].split('?')[0]
  if (/\/$/.test(plain)) return plain + 'index.html'
  return plain
}

describe('@relativeUrlToFilePath:', () => {
  test.each([
    ['', ''],
    ['/', '/index.html'],
    ['./', './index.html'],
    ['../', '../index.html'],
    ['index.html', 'index.html'],
    ['./index.html#hash', './index.html'],
    ['../dir/index.html?param=value', '../dir/index.html'],
    ['second.html', 'second.html'],
    ['../second.html', '../second.html'],
  ])('`%s` → `%s`', async (from, to) => {
    expect(relativeUrlToFilePath(from)).toBe(to)
  })
})

describe('All paths are valid:', () => {
  test.each(htmlFilePaths)(' %s', async (filePath) => {
    const text = await readFile(filePath, 'utf8')
    const allPaths = Array.from(text.matchAll(/(?:href|src)="([^"]+?)"/g)).map((match) => match[1])

    const baseDir = dirname(filePath)

    /** @type [string, { exists: boolean, isValid: boolean }][] */
    const pathStatuses = await Promise.all(
      allPaths.map(async (path) => {
        if (allowedPathList.some((allowedPath) => path === allowedPath)) {
          return [path, { exists: true, isValid: true }]
        }

        let exists = false
        try {
          await access(join(baseDir, relativeUrlToFilePath(path)))
          exists = true
        } catch (err) {
          console.error(err)
        }

        const isValid = isValidPath(path)
        return [path, { exists, isValid }]
      })
    )

    const invalidPathStatuses = pathStatuses
      .filter((pathStatus) => {
        const [, { exists, isValid }] = pathStatus
        return !exists || !isValid
      })
      .map((status) => (process.env.NODE_ENV === 'debug' ? status : status[0]))

    expect(invalidPathStatuses).toHaveLength(0)
  })
})

describe('All image file names are varid:', () => {
  const allowedImageExtensions = imageExtensions.join('|')

  if (imageFilePaths.length === 1 && imageFilePaths[0] === '') return

  test.each(imageFilePaths)(' %s', async (filePath) => {
    const fileName = basename(filePath)
    const regex = new RegExp(`^[0-9a-z_-]+\\.(?:${allowedImageExtensions})$`)
    const isValid = regex.test(fileName)
    expect(isValid).toBe(true)
  })
})
