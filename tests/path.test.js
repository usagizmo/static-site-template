const fs = require('fs')
const execSync = require('child_process').execSync

const find = execSync('find src -type f -name "*.pug"')
const files = find.toString().trim().split('\n')

const allowlist = [
  '/favicon.ico',
  'https://cdn.jsdelivr.net/npm/destyle.css@2.0.2/destyle.min.css',
  'https://usagizmo.com',
]
test.each(files)('The value of the href starts with `. `: %s', (file) => {
  const text = fs.readFileSync(file, 'utf8')
  const links = Array.from(text.matchAll(/href="([^.#][^"]+?)"/g))
    .map((match) => match[1])
    .filter((path) => !allowlist.includes(path))
  expect(links).toHaveLength(0)
})
