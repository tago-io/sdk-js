module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: false,
    },
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["plugin:prettier/recommended", "plugin:@typescript-eslint/eslint-recommended"],
};
