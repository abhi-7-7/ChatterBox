/**
 * Tailwind config (CommonJS) for ChatterBox
 * Loads color tokens from ./tailwind-colors.js and exposes them under 'chatter'
 */
const colors = require('./tailwind-colors.js').chatter || {};

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        chatter: colors,
      },
      boxShadow: {
        'soft': '0 6px 20px rgba(16,24,40,0.08)',
        'sm': '0 1px 3px rgba(16,24,40,0.06)'
      }
    },
  },
  plugins: [],
};
