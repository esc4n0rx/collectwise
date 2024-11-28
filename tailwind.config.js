const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Garante que Tailwind processe os arquivos no diretório src
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
