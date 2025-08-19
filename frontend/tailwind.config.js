/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'pretendard': ['Pretendard GOV', 'Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
}

