All features can continue to be used in [usagizmo/nextjs-template](https://github.com/usagizmo/nextjs-template)

# Static Site Template

A starting point for building a static site.

## Development

### Uses

- [Turborepo](https://turborepo.org/) x [pnpm](https://pnpm.io/)
- [Prettier](https://prettier.io/) / [ESLint](https://eslint.org/) (w/ [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import))
- [lint-staged](https://github.com/okonet/lint-staged) / [husky](https://github.com/typicode/husky)
- [Renovate](https://www.whitesourcesoftware.com/free-developer-tools/renovate/) (w/ [renovate-approve](https://github.com/apps/renovate-approve))
- GitHub Actions (Formating + Linting + Testing (Validate `href` and `src` paths))
- Execute `eslint --fix` and `prettier` when saving with VS Code

### Apps and Packages

- **apps**
  - `web` - Static Site  
    [Tailwind CSS](https://tailwindcss.com/) / [Rollup](https://rollupjs.org/)  
    [HTMLHint](https://htmlhint.com/) / [webhint](https://webhint.io/)
- **packages**
  - `eslint-preset` - Base settings used by `.eslintrc.cjs` for each package
  - `lintstagedrc` - Base settings used by `.lintstagedrc.js` for each package
  - `pathtest-utils` - Used in `apps/web/test/path.test.js`
  - `script-modules` - JS modules used in `apps/web/src/script.js`
  - `tailwind-config-base` - Used in `apps/web/tailwind.config.cjs`

### VS Code Extensions (Recommend)

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [HTMLHint](https://marketplace.visualstudio.com/items?itemName=mkaufman.HTMLHint) / [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) / [webhint](https://marketplace.visualstudio.com/items?itemName=webhint.vscode-webhint)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) / [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Commands

```bash
pnpm i

pnpm build   # Build `apps/web/src/[styles.css,script.js]` and output `apps/web/public/*`
pnpm dev     # Watch and build `apps/web/src/[styles.css,script.js]`
pnpm lint    # Linting
pnpm format  # Format with `eslint --fix` and `prettier`
pnpm test    # Testing

# apps/web
pnpm clean   # Remove unused image files in `public/images/*`
pnpm deploy  # When deploying to a VPS such as DigitalOcean using `rsync`
```

## Subresource Integrity

You can use the openssl command to generate an SRI hash.

```bash
curl "<url>" | openssl dgst -sha384 -binary | openssl base64 -A
```

Ref: [Subresource Integrity - Web security | MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)

## Use renovate on GitHub

Give [Renovate](https://www.whitesourcesoftware.com/free-developer-tools/renovate/) and [renovate-approve](https://github.com/apps/renovate-approve) permission to operate the repository.

Then change your GitHub settings as follows.

`Settings` > `Branches` > `Branch protection rule`

- Branch name pattern: `main`
- Protect matching branches:
  - [x] Require a pull request before merging
    - [x] Require approvals: `[1]`
  - [x] Require status checks to pass before merging
    - Status checks that are required:
      - `Build (Node 16 on ubuntu-latest)`
      - `Vercel`

## Published on Vercel

`General` > `Build & Development Settings`

- FRAMEWORK PRESET: `Other`
- OUTPUT DIRECTORY: `apps/web/public`
- INSTALL COMMAND: `npm i pnpm -g && pnpm i`

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
const directory = path.join(__dirname, '/apps/web/public')

const app = protect(
  '/',
  (username, password) =>
    safeCompare(username, '<username>') && safeCompare(password, '<password>'),
  {
    directory,
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
"build": "turbo run build",
+ "vercel-build": "npm run build",
```
