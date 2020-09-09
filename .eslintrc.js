module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'no-unused-vars': ['error', { argsIgnorePattern: 'next|value' }],
    'no-console': 'off',
  },
  parserOptions: {
    sourceType: 'module',
  },
};
