const fs = require('fs');
const cp = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

const constant = require('./configs/constant');
const config = require('./configs/config');
const rules = require('./configs/rules');

// 依赖集合
const depsSet = new Set();
depsSet.add('eslint');
depsSet.add('babel-eslint');

function makeEslintrc({ env, extendConfigs, styleConfigs, usePrettier }) {
  const template = require('./templates/eslintrc');

  const extendSet = new Set();
  const pluginSet = new Set();

  if (env === constant.REACT) {
    template.parserOptions.ecmaFeatures.jsx = true;
  } else if (env === constant.VUE) {
    delete template.parser;
    template.parserOptions.parser = 'babel-eslint';
  }

  if (usePrettier) {
    extendConfigs.push('PRETTIER_CONFIG');
  }

  extendConfigs.forEach(conf => {
    const { extend, plugin, deps = [] } = config[conf];
    extend && extendSet.add(extend);
    plugin && pluginSet.add(plugin);
    deps.forEach(dep => depsSet.add(dep));
  });

  template.extends = [...extendSet];
  template.plugins = [...pluginSet];
  template.rules = rules[env];

  // .eslintrc也要按照选择的空格数安装噢
  fs.writeFileSync('.eslintrc', JSON.stringify(template, null, styleConfigs.tabWidth));
}

function makePrettierrc({ tabWidth, singleQuote, trailingComma }) {
  const template = require('./templates/prettierrc');
  Object.assign(template, {
    tabWidth,
    singleQuote,
    trailingComma,
  });
  fs.writeFileSync('.prettierrc', JSON.stringify(template, null, tabWidth));
}

function installDependencies() {
  return new Promise((resolve, reject) => {
    const install = cp.spawn('npm', ['install', ...depsSet, '--save-dev']);
    let err = '';

    install.stderr.on('data', data => {
      err += data;
    });

    install.on('close', code => {
      if (code) {
        reject(Error(err));
      } else {
        resolve();
      }
    });
  });
}

module.exports = async ({ env, extendConfigs, styleConfigs, usePrettier }) => {
  const spinner = ora('Creating .eslintrc..').start();
  makeEslintrc({ env, extendConfigs, styleConfigs, usePrettier });
  spinner.succeed('.eslintrc created');

  if (usePrettier) {
    const spinner1 = ora('Creating .prettierrc..').start();
    makePrettierrc(styleConfigs);
    spinner1.succeed('.prettierrc created');
  }

  const spinner2 = ora('Installing dependencies..').start();
  try {
    await installDependencies();
    spinner2.succeed(
      'Add eslint configs successfully! Plz reload the editor to ensure Eslint applys normally.'
    );
  } catch (e) {
    console.log(chalk.red(e.message));
    spinner.fail('Task failed >.<');
  }
};
