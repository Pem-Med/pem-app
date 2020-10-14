module.exports = {
  env: {
    node: true, // this is the best starting point
    browser: true, // for react web
    es6: true, // enables es6 features
    es2021: true,
  },
  parser: 'babel-eslint', // needed to make babel stuff work properly
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
  },
};
