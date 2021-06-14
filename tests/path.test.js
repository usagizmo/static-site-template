const fs = require('fs')
const execSync = require('child_process').execSync

const find = execSync('find dist -type f -name "*.html"')
const files = find.toString().trim().split('\n')

const allowlist = [
  '/favicon.ico',
  'https://cdn.jsdelivr.net/npm/destyle.css@2.0.2/destyle.min.css',
  'https://usagizmo.com',
  'https://cdn.jsdelivr.net/npm/jquery-sticky@1.0.4/jquery.sticky.min.js',
  'https://cdn.jsdelivr.net/npm/jquery-throttle-debounce@1.0.0/jquery.ba-throttle-debounce.min.js',
  'https://cdn.jsdelivr.net/npm/jquery.easing@1.4.1/jquery.easing.min.js',
  'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js',
  'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js',
]
test.each(files)('The value of the href starts with `. `: %s', (file) => {
  const text = fs.readFileSync(file, 'utf8')
  const links = Array.from(text.matchAll(/(?:href|src)="([^.#][^"]+?)"/g))
    .map((match) => match[1])
    .filter((path) => !allowlist.includes(path))
  expect(links).toHaveLength(0)
})
