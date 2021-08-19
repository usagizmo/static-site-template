const { readFile, access } = require('fs').promises
const { dirname, join, basename } = require('path')
const execSync = require('child_process').execSync

const findHtml = execSync('find dist -type f -name "*.html"')
const htmlFilePaths = findHtml.toString().trim().split('\n')

const imageExtensions = ['jpg', 'png']
const findImagesOption = imageExtensions.map((ext) => `-name "*.${ext}"`).join(' -o ')
const findImages = execSync(`find src -type f ${findImagesOption}`)
const imageFilePaths = findImages.toString().trim().split('\n')

// ref: https://regexper.com/#%5E%28%3F%3A%28%3F%3A%23%5B%5E%3F%23%5D*%29%7C%28%3F%3A%28%3F%3A%5C.%7C%5C.%5C.%29%5C%2F%28%3F%3A%5C.%5C.%5C%2F%29*%29%28%3F%3A%5B%5Cw%5D%5B%5E%22%5D%2B%7C%28%3F%3A%5C%3F%5B%5E%3F%23%5D%2B%29%3F%28%3F%3A%23%5B%5E%3F%23%5D*%29%3F%29%3F%29%24
const validPathPattern =
  /^(?:(?:#[^?#]*)|(?:(?:\.|\.\.)\/(?:\.\.\/)*)(?:[\w][^"]+|(?:\?[^?#]+)?(?:#[^?#]*)?)?)$/

describe('Path validation:', () => {
  test.each([
    ['/', false],
    ['./', true],
    ['.//', false],
    ['../', true],
    ['..//', false],
    ['.../', false],
    ['#', true],
    ['#hash', true],
    ['./#', true],
    ['./#hash', true],
    ['?', false],
    ['?param=value', false],
    ['./?', false],
    ['./?param=value', true],
    ['index.html', false],
    ['./index.html', true],
    ['../index.html', true],
    ['../dir/index.html', true],
    ['.././index.html', false],
  ])('`%s` is %s', (path, expected) => {
    expect(validPathPattern.test(path)).toBe(expected)
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

const allowlist = [
  '/favicon.ico',
  '/apple-touch-icon.png',
  'https://static-site-template.io/',
  'https://usagizmo.com',
  'https://cdn.jsdelivr.net/npm/destyle.css@2.0.2/destyle.min.css',
  'https://cdn.jsdelivr.net/npm/jquery-sticky@1.0.4/jquery.sticky.min.js',
  'https://cdn.jsdelivr.net/npm/jquery-throttle-debounce@1.0.0/jquery.ba-throttle-debounce.min.js',
  'https://cdn.jsdelivr.net/npm/jquery.easing@1.4.1/jquery.easing.min.js',
  'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js',
  'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js',
]

describe('All paths are valid:', () => {
  test.each(htmlFilePaths)(' %s', async (filePath) => {
    const text = await readFile(filePath, 'utf8')
    const allPaths = Array.from(text.matchAll(/(?:href|src)="([^"]+?)"/g)).map((match) => match[1])

    const baseDir = dirname(filePath)

    /** @type [string, { exists: boolean, isValid: boolean }][] */
    const pathStatuses = await Promise.all(
      allPaths.map(async (path) => {
        if (allowlist.some((prefix) => path.indexOf(prefix) === 0)) {
          return [path, { exists: true, isValid: true }]
        }

        let exists = false
        try {
          await access(join(baseDir, relativeUrlToFilePath(path)))
          exists = true
        } catch (err) {}

        const isValid = validPathPattern.test(path)
        return [path, { exists, isValid }]
      })
    )

    invalidPathStatuses = pathStatuses.filter((pathStatus) => {
      const [, { exists, isValid }] = pathStatus
      return !exists || !isValid
    })

    expect(invalidPathStatuses).toHaveLength(0)
  })
})

describe('All image file names are varid:', () => {
  const allowedImageExtensions = imageExtensions.join('|')

  test.each(imageFilePaths)(' %s', async (filePath) => {
    const fileName = basename(filePath)
    const regex = new RegExp(`^[0-9a-zA-Z_-]+\.(?:${allowedImageExtensions})$`)
    const isValid = regex.test(fileName)
    expect(isValid).toBe(true)
  })
})
