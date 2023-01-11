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
        // primary: {
        //   50: '#eef7f0',
        //   100: '#cbe7d1',
        //   200: '#a8d6b2',
        //   300: '#86c693',
        //   400: '#63b674',
        //   500: '#499c5a',
        //   600: '#397946',
        //   700: '#295732',
        //   800: '#18341e',
        //   900: '#08110a',
        // },
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
          dark: colors.gray['200'],
        },
        descriptions: {
          light: colors.gray['500'],
          dark: colors.gray['400'],
        },
        bases: {
          light: colors.gray['700'],
          dark: colors.gray['300'],
        },
      },
      borderColor: {
        base: {
          light: colors.zinc['200'],
          dark: colors.zinc['700'],
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
