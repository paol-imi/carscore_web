//** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "main-gradient":
          "radial-gradient(60% 24.85% at 81.76% -.3%,#A208BC 0%,#430971 100%)",
        "decorative-gradient":
          "radial-gradient(64.11% 402.13% at 24.53% -37.63%, #F796FF 0%, #CA39E1 37.5%, #8E3BD0 70.83%, #8026C8 100%)",
      },
      colors: {
        "main-purple": "#BB33D0",
        "dark-purple": "#430971",
        "darkest-purple": "#320755",
      },
    },
  },
  plugins: [],
};
