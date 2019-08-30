module.exports = {
  ESLINT_CONFIG: {
    extend: 'eslint:recommended',
  },
  AIRBNB_BASE_CONFIG: {
    extend: 'airbnb-base',
    deps: ['eslint-config-airbnb-base', 'eslint-plugin-import'],
  },
  AIRBNB_CONFIG: {
    extend: 'airbnb',
    deps: [
      'eslint-config-airbnb',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-import',
      'eslint-plugin-react',
    ],
  },
  REACT_CONFIG: {
    extend: 'plugin:react/recommended',
    deps: ['eslint-plugin-react', 'eslint-plugin-import', 'eslint-plugin-jsx-a11y'],
  },
  VUE_CONFIG: {
    extend: 'plugin:vue/strongly-recommended',
    deps: ['eslint-plugin-vue'],
  },
  PRETTIER_CONFIG: {
    extend: 'plugin:prettier/recommended',
    deps: ['eslint-plugin-prettier', 'eslint-config-prettier', 'prettier'],
  },
};
