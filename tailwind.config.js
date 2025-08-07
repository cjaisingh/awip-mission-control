const { SSOT_CONFIG } = require('./src/config/ssot');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: SSOT_CONFIG.design.colors.primary,
      },
      fontFamily: {
        sans: SSOT_CONFIG.design.fonts.sans,
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 