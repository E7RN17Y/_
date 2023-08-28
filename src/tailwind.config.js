/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/js/Pages/**/*.jsx",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
        fontFamily: {
            'poppins': ['Poppins', 'sans-serif'],
            'cedarville': 'Cedarville Cursive',
            'dawning': 'Dawning of a New Day',
            'gupter': 'Gupter'
        },
    },
  },
  plugins: [],
}

