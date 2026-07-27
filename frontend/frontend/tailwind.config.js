/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "spice market" theme - deep charcoal base, saffron + chili accents
        charcoal: "#1F1B18",
        saffron: "#E8A93B",
        chili: "#C4432B",
        cream: "#FBF6EE",
        leaf: "#4C6B4F",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
