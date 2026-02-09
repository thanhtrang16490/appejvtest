/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#175ead',
          light: '#2575be',
          dark: '#145a9d',
        },
      },
    },
  },
  plugins: [],
}
