# Static Site Template

A great, small starting point for building a static site.

- Pug / PostCSS / Vanilla JS
- Gulp / HTMLHint / ESLint / Stylelint
- husky / lint-staged / Prettier
- GitHub Actions (Cache node_modules / Formating + Linting + Testing (Validate `href` and `src` paths))

[Demo](https://static-site-template.usagizmo.com/)

## Development

```bash
yarn
yarn format  # Format with prettier
yarn lint    # Linting
yarn build   # Linting and building
yarn dev     # Launch the browser-sync server to watch and build files
yarn test    # Testing (It needs to be run after `build`.)
yarn deploy  # When deploying to a VPS such as DigitalOcean using `rsync`
```
