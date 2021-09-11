# Static Site Template

A great, small starting point for building a static site.

[Demo](https://static-site-template.usagizmo.com/)

## Development

### Uses

- [Tailwind CSS](https://tailwindcss.com/) ([JIT](https://tailwindcss.com/docs/just-in-time-mode#enabling-jit-mode)) / Vanilla JS
- [HTMLHint](https://htmlhint.com/) / [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/) / [lint-staged](https://github.com/okonet/lint-staged) / [husky](https://github.com/typicode/husky)
- GitHub Actions (Formating + Linting + Testing (Validate `href` and `src` paths))

### VS Code Extensions (Recommend)

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [HTMLHint](https://marketplace.visualstudio.com/items?itemName=mkaufman.HTMLHint) / [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) / [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Commands

```bash
yarn
yarn format  # Format with prettier
yarn build   # Build tailwind.css and output src/public/styles.css
yarn dev     # Launch the browser-sync server to watch and build files
yarn lint    # Linting
yarn test    # Testing
yarn deploy  # When deploying to a VPS such as DigitalOcean using `rsync`
```
