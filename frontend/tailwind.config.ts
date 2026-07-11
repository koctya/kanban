import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#ecad0a',
        primary: '#209dd7',
        secondary: '#753991',
        navy: '#032147',
        graytext: '#888888'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(3, 33, 71, 0.12)'
      }
    }
  },
  plugins: []
}

export default config
