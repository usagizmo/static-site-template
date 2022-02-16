# Static Site Template

A small starting point for building a static site.

[Demo](https://static-site-template.usagizmo.com/)

## Development

### Uses

- [Tailwind CSS](https://tailwindcss.com/) (v3) / [Rollup](https://rollupjs.org/) (Vanilla)
- [HTMLHint](https://htmlhint.com/) / [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/) / [lint-staged](https://github.com/okonet/lint-staged) / [husky](https://github.com/typicode/husky)
- GitHub Actions (Formating + Linting + Testing (Validate `href` and `src` paths))
- Node (`v8+`) / [pnpm](https://pnpm.io/)

### VS Code Extensions

#### Recommend

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [HTMLHint](https://marketplace.visualstudio.com/items?itemName=mkaufman.HTMLHint) / [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) / [webhint](https://marketplace.visualstudio.com/items?itemName=webhint.vscode-webhint)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) / [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Commands

```bash
pnpm i
pnpm format  # Format with prettier
pnpm build   # Build src/css/[styles.css,script.js] and output src/public/*
pnpm clean   # Remove unused image files in src/public/images/*
pnpm dev     # Watch and build src/css/[styles.css,script.js]
pnpm lint    # Linting
pnpm test    # Testing
pnpm deploy  # When deploying to a VPS such as DigitalOcean using `rsync`
```

## Subresource Integrity

You can use the openssl command to generate an SRI hash.

```bash
curl "<url>" | openssl dgst -sha384 -binary | openssl base64 -A
```

Ref: [Subresource Integrity - Web security | MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)

### With Basic Authentication

```bash
# Add packages
pnpm add -D static-auth safe-compare
```

Run the following, then change the `username` and `password` in `index.js`.

```bash
# vercel.json
printf "{
  \"builds\": [
    {
      \"src\": \"index.js\",
      \"use\": \"@vercel/node\"
    }
  ],
  \"routes\": [{ \"src\": \"/.*\", \"dest\": \"index.js\" }]
}
" > vercel.json

# index.js
printf "const path = require('path')
const protect = require('static-auth')
const safeCompare = require('safe-compare')

const app = protect(
  '/',
  (username, password) =>
    safeCompare(username, '<username>') && safeCompare(password, '<password>'),
  {
    directory: path.join(__dirname, '/src/public'),
    onAuthFailed: (res) => {
      res.end('Authentication failed')
    },
  }
)

module.exports = app
" > index.js
```

Add the `vercel-build` command to `package.json`.

```diff
"build": "concurrently \"npm:build:tailwind\" \"npm:build:js\"",
+ "vercel-build": "npm run build",
```
