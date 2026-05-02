/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        card: "#111111",
        text: "#eeeeee",
        textDim: "#888888",
        accent: "#ff3366",
        border: "#222222",
        likeButton: "#cc3366",
      },
    },
  },
  plugins: [],
};
