const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./src/public/**/*.{html,js}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      // When not using Web fonts
      // sans: '-apple-system, blinkMacSystemFont, Helvetica, "Yu Gothic", YuGothic, "BIZ UDPGothic", Meiryo, sans-serif',
      // sans: '-apple-system, blinkMacSystemFont, Helvetica, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "BIZ UDPGothic", Meiryo, sans-serif',
      sans: ['Inter', 'yakuhanjp_Noto', 'Noto Sans CJK JP', 'Noto Sans JP', 'sans-serif'],
      mono: ['Source Code Pro', 'Noto Sans CJK JP', 'Noto Sans JP', 'monospace'],
      keycode: ['Lucida Grande'],
    },
    container: {
      center: true,
      padding: '24px',
    },
    colors: {
      // https://tailwindcss.com/docs/customizing-colors
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      blueGray: colors.blueGray,
      coolGray: colors.coolGray,
      gray: colors.gray,
      trueGray: colors.trueGray,
      warmGray: colors.warmGray,
      red: colors.red,
      orange: colors.orange,
      amber: colors.amber,
      yellow: colors.yellow,
      lime: colors.lime,
      green: colors.green,
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky,
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      pink: colors.pink,
      rose: colors.rose,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
