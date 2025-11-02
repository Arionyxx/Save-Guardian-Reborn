/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Catppuccin Macchiato palette
        ctp: {
          // Base colors
          base: '#24273a',
          mantle: '#1e2030',
          crust: '#181926',
          // Surface colors
          surface0: '#363a4f',
          surface1: '#494d64',
          surface2: '#5b6078',
          // Overlay colors
          overlay0: '#6e738d',
          overlay1: '#8087a2',
          overlay2: '#939ab7',
          // Text colors
          text: '#cad3f5',
          subtext1: '#b8c0e0',
          subtext0: '#a5adcb',
          // Accent colors
          mauve: '#c6a0f6',
          lavender: '#b7bdf8',
          blue: '#8aadf4',
          sapphire: '#7dc4e4',
          sky: '#91d7e3',
          teal: '#8bd5ca',
          green: '#a6da95',
          yellow: '#eed49f',
          peach: '#f5a97f',
          maroon: '#ee99a0',
          red: '#ed8796',
          pink: '#f5bde6',
          flamingo: '#f0c6c6',
          rosewater: '#f4dbd6'
        },
        // Semantic color mappings for easy access
        gaming: {
          dark: {
            bg: '#181926',
            surface: '#1e2030',
            card: '#24273a',
            hover: '#363a4f',
            border: '#494d64'
          }
        },
        status: {
          success: '#a6da95',
          warning: '#eed49f',
          error: '#ed8796',
          info: '#8aadf4'
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(198, 160, 246, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(198, 160, 246, 0.8)' }
        }
      },
      backgroundImage: {
        'gradient-gaming': 'linear-gradient(135deg, #c6a0f6 0%, #b7bdf8 100%)',
        'gradient-gaming-hover': 'linear-gradient(135deg, #8aadf4 0%, #7dc4e4 100%)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('daisyui')],
  daisyui: {
    themes: [
      {
        gaming: {
          primary: '#c6a0f6',
          'primary-focus': '#b087e8',
          'primary-content': '#181926',
          secondary: '#b7bdf8',
          'secondary-focus': '#a4aae5',
          'secondary-content': '#181926',
          accent: '#7dc4e4',
          'accent-focus': '#5fb0d6',
          'accent-content': '#181926',
          neutral: '#24273a',
          'neutral-focus': '#1e2030',
          'neutral-content': '#cad3f5',
          'base-100': '#24273a',
          'base-200': '#1e2030',
          'base-300': '#181926',
          'base-content': '#cad3f5',
          info: '#8aadf4',
          success: '#a6da95',
          warning: '#eed49f',
          error: '#ed8796'
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
