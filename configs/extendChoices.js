const constant = require('./constant.js');

module.exports = {
  [constant.NODEJS]: {
    choices: [
      {
        name: 'eslint:recommended',
        value: 'ESLINT_CONFIG',
      },
      {
        name: 'airbnb-base',
        value: 'AIRBNB_BASE_CONFIG',
      },
    ],
    default: ['ESLINT_CONFIG', 'AIRBNB_BASE_CONFIG'],
  },
  [constant.REACT]: {
    choices: [
      {
        name: 'eslint:recommended',
        value: 'ESLINT_CONFIG',
      },
      {
        name: 'react',
        value: 'REACT_CONFIG',
      },
      {
        name: 'airbnb',
        value: 'AIRBNB_CONFIG',
      },
    ],
    default: ['ESLINT_CONFIG', 'REACT_CONFIG'],
  },
  [constant.VUE]: {
    choices: [
      {
        name: 'eslint:recommended',
        value: 'ESLINT_CONFIG',
      },
      {
        name: 'vue',
        value: 'VUE_CONFIG',
      },
    ],
    default: ['ESLINT_CONFIG', 'VUE_CONFIG'],
  },
};
