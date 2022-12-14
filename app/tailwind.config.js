const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        amber: colors.amber,
        emerald: colors.emerald,
        cyan: colors.cyan,
        unibrown: "#F26E50",
        uniblue: "#5BCEFC",
        uniyellow: "#F0ED62",
      },

      // fontFamily: {
      //   sans: ["-apple-system"],
      //   // serif: ["ui-serif"],
      //   // mono: ["ui-monospace"],
      // },

      screens: {
        mobile: { min: "200px", max: "800px" },
        // => @media (min-width: 200px) (max-width: 800px{ ... }

        desktop: "800px",
        // => @media (min-width: 800px) { ... }

        tall: { raw: "(min-height: 800px)" },
        // => @media (min-height: 800px) { ... }
      },

      minHeight: {
        // '1/4': '25%',
        "1/2": "50%",
      },

      minWidth: {
        // '1/4': '25%',
        "1/2": "50%",
      },

      blur: {
        xxs: "1px",
        xs: "2px",
      },

      dropShadow: {
        "3xl": "0 35px 35px rgba(0, 0, 0, 0.25)",
        "4xl": [
          "0 35px 35px rgba(0, 0, 0, 0.25)",
          "0 45px 65px rgba(0, 0, 0, 0.15)",
        ],
        text: "0 2px 2px rgb(50 120 150 / 0.65)",
        uniyellow: "0 2px 2px rgb(240 237 98 / 0.65)",
        uniblue: "0 2px 2px rgb(91 206 252 / 0.65)",
        unibrown: "3px 2px 2px rgb(242 110 80 / 0.50)",
      },

      animation: {
        blob: "blob 7s infinite",
      },

      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
            // top: "-300px",
            // left: "200px",
            // right: "-300px",
            // width: "100%",
          },
          "33%": {
            transform: "translate(50px, -80px) scale(1.1)",
            // top: "-130px",
            // left: "-80px",
            // right: "-60px",
            // width: "100%",
          },
          "66%": {
            transform: "translate(-30px, 30px) scale(0.9)",
            // top: "80px",
            // left: "30px",
            // right: "0px",
            // width: "70%",
          },
          "100%": {
            transform: "tranlate(0px, 0px) scale(1)",
            // top: "-300px",
            // left: "200px",
            // right: "-300px",
            // width: "100%",
          },
        },
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
    },
  },
  variants: {
    extend: {},
  },
  content: ["node_modules/daisyui/dist/**/*.js"],
  plugins: [require("daisyui")],
};

// {'postcss-import': {},tailwindcss: {},
//   autoprefixer: {}}
