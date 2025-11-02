/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Blue/Cyan gaming palette
        gaming: {
          blue: {
            50: '#e6f7ff',
            100: '#bae7ff',
            200: '#91d5ff',
            300: '#69c0ff',
            400: '#40a9ff',
            500: '#1890ff',
            600: '#096dd9',
            700: '#0050b3',
            800: '#003a8c',
            900: '#002766',
            950: '#001529'
          },
          cyan: {
            50: '#e6fffb',
            100: '#b5f5ec',
            200: '#87e8de',
            300: '#5cdbd3',
            400: '#36cfc9',
            500: '#13c2c2',
            600: '#08979c',
            700: '#006d75',
            800: '#00474f',
            900: '#002329'
          },
          dark: {
            bg: '#0a0e1a',
            surface: '#111827',
            card: '#1a1f35',
            hover: '#252b45',
            border: '#2d3548'
          }
        },
        status: {
          success: '#52c41a',
          warning: '#faad14',
          error: '#f5222d',
          info: '#1890ff'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        gaming: ['Rajdhani', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(24, 144, 255, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(24, 144, 255, 0.8)' }
        }
      },
      backgroundImage: {
        'gradient-gaming': 'linear-gradient(135deg, #0050b3 0%, #006d75 100%)',
        'gradient-gaming-hover': 'linear-gradient(135deg, #096dd9 0%, #08979c 100%)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('daisyui')],
  daisyui: {
    themes: [
      {
        gaming: {
          primary: '#1890ff',
          'primary-focus': '#096dd9',
          'primary-content': '#ffffff',
          secondary: '#13c2c2',
          'secondary-focus': '#08979c',
          'secondary-content': '#ffffff',
          accent: '#36cfc9',
          'accent-focus': '#13c2c2',
          'accent-content': '#ffffff',
          neutral: '#1a1f35',
          'neutral-focus': '#111827',
          'neutral-content': '#e6f7ff',
          'base-100': '#0a0e1a',
          'base-200': '#111827',
          'base-300': '#1a1f35',
          'base-content': '#e6f7ff',
          info: '#1890ff',
          success: '#52c41a',
          warning: '#faad14',
          error: '#f5222d'
        }
      },
      'light',
      'dark'
    ],
    base: true,
    styled: true,
    utils: true,
    logs: false,
    darkTheme: 'gaming'
  }
}
