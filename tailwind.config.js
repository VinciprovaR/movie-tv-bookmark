module.exports = {
  content: ["./src/**/*.{html,js, ts}"],
  theme: {
    screens: {
      smc: "470px",
      sm: "640px",
      md: "768px",
      mdc: "796px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
