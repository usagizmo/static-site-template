# Static Site Template

A great, small starting point for building a static site.

- Plain CSS / JS
- eslint / stylelint
- prettier
- husky + lint-staged
- GitHub Actions (Linting + Formatting)

## Development

```bash
yarn
yarn format    # Format files that are not written in .prettierignore
yarn dev       # Launch the browser-sync server
yarn lint      # Linting of JS and CSS files
yarn lint:fix  # Linting and Formatting of JS and CSS files
yarn deploy    # When deploying to a VPS such as DigitalOcean using `rsync`

# Launch the browser-sync server (without CSS watching)
# To use synchronous editing of CSS styles in Chrome's Developer Tools
yarn dev:ignore-css
```

## Deploy a static site to Vercel with Basic Auth

```bash
# Add packages
yarn add -D static-auth safe-compare
```

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
printf "const protect = require('static-auth')
const safeCompare = require('safe-compare')

const app = protect(
  '/',
  (username, password) =>
    safeCompare(username, process.env.BASIC_USER) && safeCompare(password, process.env.BASIC_PASS),
  {
    directory: __dirname + '/public',
    onAuthFailed: (res) => {
      res.end('Authentication failed')
    },
  }
)

module.exports = app
" > index.js
```

### Deploy on Vercel

```bash
# Link
vercel link
# ? What’s your project’s name? <kebab-case-project-name>

# Set the `Environment Variables` in the Vercel.
vercel env add plain BASIC_USER
vercel env add plain BASIC_PASS
# ? What’s the value of BASIC_PASS? [hidden]
# ? Add BASIC_PASS to which Environments (select multiple)? Production, Preview, Development

# Develop
vercel dev

# Deploy
vercel
# Or integrate with Vercel and GitHub
# In that case, don't forget to set the `packages/app` option to "Settings > General > Root Directory" on Vercel
```
