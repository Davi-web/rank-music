/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@acme/tailwind-config")],
  darkMode: "false",

  theme: {
    fontFamily: {
      robotoMono: ["Roboto Mono", "monospace"],
    },
    extend: {
      backgroundColor: {
        "purple-rgba": "rgba(186,104,200,0.5)",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
};
