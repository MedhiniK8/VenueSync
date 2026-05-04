/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tealbrand: '#028090',
        tealbrandSoft: '#00A896',
        bluebrand: '#1C7293',
        bluebrandDeep: '#065A82'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 128, 144, 0.08)'
      }
    }
  },
  plugins: []
};
