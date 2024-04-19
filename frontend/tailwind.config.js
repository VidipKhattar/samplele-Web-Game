/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "gradient-xy": "gradient-xy 10s ease infinite",
        "flash-green": "flash-green 2s linear",
      },
      keyframes: {
        "flash-green": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
    },
  },
  plugins: [],
};
