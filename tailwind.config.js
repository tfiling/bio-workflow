/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0F9',
          100: '#CCE1F3',
          200: '#99C3E6',
          300: '#66A5DA',
          400: '#3387CD',
          500: '#0A5C99', // main primary
          600: '#084A7A',
          700: '#06375C',
          800: '#04253D',
          900: '#02121F',
        },
        secondary: {
          50: '#E6FAF9',
          100: '#CCF5F3',
          200: '#99EBE7',
          300: '#66E0DB',
          400: '#33D6CF',
          500: '#00B8A9', // main secondary
          600: '#009387',
          700: '#006E65',
          800: '#004A44',
          900: '#002522',
        },
        accent: {
          50: '#F2EFFA',
          100: '#E5DFF5',
          200: '#CCBFEB',
          300: '#B29FE0',
          400: '#997FD6',
          500: '#9768D1', // main accent
          600: '#7953A7',
          700: '#5B3F7D',
          800: '#3D2A54',
          900: '#1E152A',
        },
        success: {
          50: '#E6F6EC',
          100: '#CCEDD9',
          200: '#99DBB3',
          300: '#66C98D',
          400: '#33B766',
          500: '#00A540',
          600: '#008433',
          700: '#006327',
          800: '#00421A',
          900: '#00210D',
        },
        warning: {
          50: '#FEF5E7',
          100: '#FDEBCF',
          200: '#FBD69F',
          300: '#F9C26F',
          400: '#F7AD3F',
          500: '#F5990F',
          600: '#C47A0C',
          700: '#935C09',
          800: '#623D06',
          900: '#311F03',
        },
        error: {
          50: '#FDEDEB',
          100: '#FBDBD7',
          200: '#F7B7AF',
          300: '#F39387',
          400: '#EF6F5F',
          500: '#EB4B37',
          600: '#BC3C2C',
          700: '#8D2D21',
          800: '#5E1E16',
          900: '#2F0F0B',
        },
        gray: {
          50: '#F7F9FA',
          100: '#EFF2F5',
          200: '#DFE5EB',
          300: '#CFD8E0',
          400: '#BFCBD6',
          500: '#AFBECC',
          600: '#8C98A3',
          700: '#69727A',
          800: '#464C52',
          900: '#232629',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      }
    },
  },
  plugins: [],
};