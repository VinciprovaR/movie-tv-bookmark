module.exports = {
  content: ["./src/**/*.{html,js, ts}"],
  theme: {
    screens: {
      xxxsm: "205px",
      xxsm: "244px",
      xsm: "382px",
      401: "401px",
      smc: "470px",
      510: "510px",
      sm: "640px",
      md: "768px",
      mdc: "796px",
      md2c: "920px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
