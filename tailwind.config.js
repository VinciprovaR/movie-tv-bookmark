module.exports = {
  content: ["./src/**/*.{html,js, ts}"],
  theme: {
    screens: {
      205: "205px",
      244: "244px",
      350: "350px",
      382: "382px",
      401: "401px",
      470: "470px",
      621: "621px",
      640: "640px",
      670: "670px",
      700: "700px",
      768: "768px",
      896: "896px",
      1024: "1024px",
      1200: "1200px",
      1280: "1280px",
      1485: "1485px",
    },
    extend: {
      animation: {
        "spin-slow": "spin 2s linear infinite", // Slower spin
        "spin-fast": "spin 500ms linear infinite", // Faster spin
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
