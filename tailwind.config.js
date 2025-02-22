/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        background: "#343541", // Dark grayish background (ChatGPT-like)
        foreground: "#40414F", // Slightly lighter gray
        textPrimary: "#E0E0E0", // Light text for readability
        accent: "#10A37F", // ChatGPT's green accent color
      },
    },
  },
  plugins: [],
};
