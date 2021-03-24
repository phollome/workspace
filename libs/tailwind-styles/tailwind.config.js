module.exports = {
  purge: ["./../../libs/**/src/**/*.tsx", "./../../apps/**/src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  variants: {
    extend: { backgroundColor: ["odd"] },
  },
  plugins: [],
};
