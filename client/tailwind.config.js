/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FBE9D0',
          100: '#F7D3A1',
          200: '#F0A672',
          300: '#E64833',
          400: '#D43D2A',
          500: '#E64833',
          600: '#C73E2A',
          700: '#A83422',
          800: '#8A2B1A',
          900: '#6C2112',
        },
        secondary: {
          50: '#F4F6F6',
          100: '#E9EDED',
          200: '#D3DBDB',
          300: '#BDC9C9',
          400: '#A7B7B7',
          500: '#90AEAD',
          600: '#738B8A',
          700: '#566867',
          800: '#394544',
          900: '#1C2221',
        },
        accent: {
          50: '#F5F2F1',
          100: '#EBE5E3',
          200: '#D7CBC7',
          300: '#C3B1AB',
          400: '#AF978F',
          500: '#874F41',
          600: '#6C3F34',
          700: '#512F27',
          800: '#361F1A',
          900: '#1B0F0D',
        },
        dark: {
          50: '#F4F6F7',
          100: '#E9EDF0',
          200: '#D3DBE1',
          300: '#BDC9D2',
          400: '#A7B7C3',
          500: '#90AEAD',
          600: '#738B8A',
          700: '#566867',
          800: '#244855',
          900: '#1A3239',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'mesh-2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'mesh-3': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      }
    },
  },
  plugins: [],
}
