const { createGlobPatternsForDependencies } = require('@nx/react/tailwind')
const { join } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        economica: ['Economica Regular', 'sans-serif'],
        furore: ['Furore', 'sans-serif'],
        galada: ['Galada Regular', 'sans-serif'],
        heading: ['Forty Second Street', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
