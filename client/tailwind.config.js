/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0193DC',
        secondary: '#0C101A',
        tertiary: '#3A4E50',
        navbar: '#101524',
        'medium-dark': '#919FAE'
      },
      fontFamily: {
        bengali: ['"Noto Sans Bengali"', 'sans-serif'],
      },
    }
  },
  plugins: []
}
