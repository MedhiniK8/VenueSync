/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tealbrand: '#028090',
        tealbrandSoft: '#00A896',
        bluebrand: '#1C7293',
        bluebrandDeep: '#065A82',
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Primary Teal
          600: '#0d9488', // Hover Teal
          700: '#0f766e', // Deep Teal
          800: '#115e59',
          900: '#134e4a',
        },
        slate: {
          850: '#151e2e',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  plugins: []
};
