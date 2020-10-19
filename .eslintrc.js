module.exports = {
  env: {
    node:                        true, // this is the best starting point
    browser:                     true, // for react web
    es6:                         true, // enables es6 features
    es2021:                      true,
    jest:                        true,
    'react-native/react-native': true,
  },
  parser:  'babel-eslint', // needed to make babel stuff work properly
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType:  'module',
  },
  plugins: [
    'react',
    'react-native',
    'react-hooks',
  ],
  globals: {
    fetch: false,
  },
  rules: {
    'linebreak-style': 0,
    semi:              [
      'error',
      'never',
    ],
    'key-spacing': [
      'error',
      {
        align: 'value',
      },
    ],
    'arrow-parens': [
      'error',
      'always',
    ],
    'arrow-body-style': [
      2,
      'as-needed',
    ],
    'class-methods-use-this': 0,
    'comma-dangle':           [
      2,
      'always-multiline',
    ],
    'function-paren-newline': 0,
    indent:                   [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
    'max-len':                         0,
    'newline-per-chained-call':        2,
    'prefer-destructuring':            0,
    'no-confusing-arrow':              0,
    'no-console':                      1,
    'no-debugger':                     1,
    'no-use-before-define':            0,
    'prefer-promise-reject-errors':    0,
    'prefer-template':                 2,
    'react/jsx-props-no-multi-spaces': 1,
    'react/jsx-curly-brace-presence':  [
      2,
      {
        props:    'always',
        children: 'never',
      },
    ],
    'react/jsx-first-prop-new-line': [
      2,
      'multiline',
    ],
    'react/jsx-filename-extension':    0,
    'react/jsx-no-target-blank':       0,
    'react/jsx-indent':                [2, 2],
    'react/jsx-props-no-spreading':    1,
    'react/forbid-prop-types':         0,
    'react/prefer-stateless-function': [2, {
      ignorePureComponents: true,
    }],
    'react/prop-types':                  1,
    'react/sort-comp':                   1,
    'react/require-default-props':       0,
    'react/require-extension':           0,
    'react/self-closing-comp':           1,
    'react/destructuring-assignment':    0,
    'import/imports-first':              0,
    'import/newline-after-import':       0,
    'import/no-dynamic-require':         0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default':        0,
    'import/no-unresolved':              2,
    'import/no-webpack-loader-syntax':   0,
    'import/prefer-default-export':      0,
  },
}
