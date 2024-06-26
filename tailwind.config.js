/** @type {import('tailwindcss').Config} */
export default {
  content: ["./entrypoints/**/*.{html,js,ts,jsx,tsx}", "./components/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['pixel, sans-serif'],
        geist: ['Geist, sans-serif'],
      }
    },
  },
  plugins: [],
}

