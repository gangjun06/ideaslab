const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        nav: '80%',
      },
      colors: {
        primary: colors.emerald,
      },
      // backgroundColor: {
      //   light: colors.zinc['50'],
      //   dark: '#1f2224',
      // },
      textColor: {
        titles: {
          light: colors.gray['900'],
          dark: colors.gray['100'],
        },
        subtitles: {
          light: colors.gray['700'],
          dark: colors.gray['100'],
        },
        descriptions: {
          light: colors.gray['500'],
          dark: colors.gray['400'],
        },
        bases: {
          light: colors.gray['600'],
          dark: colors.gray['400'],
        },
      },
      borderColor: {
        base: {
          light: colors.gray['300'],
          dark: colors.gray['600'],
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
