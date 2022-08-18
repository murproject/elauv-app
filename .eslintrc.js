const isFixMode = process.argv.includes('--fix');

const config = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'google',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'require-jsdoc': 0,
    'valid-jsdoc': 0,
    'new-cap': 0,
    'max-len': 0,
    'guard-for-in': 0,
    'no-invalid-this': 0,
    'camelcase': 0,
    'no-unused-vars': 0,
    'key-spacing': 0,
    'spaced-comment': 0,
    'no-console': 0, // TODO: should enable later

    ...(isFixMode && {
      'key-spacing': 0,
      'spaced-comment': 0,
    }),
  },
};

module.exports = config;
