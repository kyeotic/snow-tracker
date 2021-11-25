module.exports = {
  extends: ['@kyeotic/eslint-config', 'plugin:react/jsx-runtime'],
  rules: {
    'react/display-name': 0,
  },
  globals: { fetch: false },
}
