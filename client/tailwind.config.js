/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/JSX/TS/TSX files inside src
  ],
  theme: {
    extend: {
      colors: {
        // You can extend theme colors here
        foreground: "hsl(var(--foreground))", // example: shadcn/ui uses CSS vars
        background: "hsl(var(--background))",
      },
    },
  },
  plugins: [],
};