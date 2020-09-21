module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["always"],
    "@typescript-eslint/no-var-requires": ["off"],
    "eol-last": ["error", "always"],
    "no-unnessesary-semi": ["off"],
    "@typescript-eslint/no-extra-semi": ["off"],
  },
};
