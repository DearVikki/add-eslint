const inquirer = require('inquirer');
const commander = require('commander');
const chalk = require('chalk');
const debug = require('debug')('add-eslint');

const extendChoices = require('./configs/extendChoices');
const constant = require('./configs/constant');
const makeFile = require('./makeFile.js');

async function queryEnv() {
  const queries = {
    message: 'Whats the type of this program?',
    name: 'env',
    type: 'list',
    choices: [
      { name: 'js/nodejs', value: constant.NODEJS },
      { name: 'react', value: constant.REACT },
      { name: 'vue', value: constant.VUE },
    ],
    default: constant.NODEJS,
  };
  return (await inquirer.prompt([queries])).env;
}

async function queryExtends(env) {
  const queries = {
    message: 'Please select your favorite extends..',
    name: 'extends',
    type: 'checkbox',
    choices: extendChoices[env].choices,
    default: extendChoices[env].default,
  };
  return (await inquirer.prompt([queries])).extends;
}

async function queryStyles() {
  const queries = [
    {
      message: 'Tab 2 or tab 4?',
      name: 'tabWidth',
      type: 'list',
      choices: [{ name: '2', value: 2 }, { name: '4', value: 4 }],
      default: 2,
    },
    {
      message: 'Single quote or double quote?',
      name: 'singleQuote',
      type: 'list',
      choices: [{ name: 'single', value: true }, { name: 'double', value: false }],
      default: true,
    },
    {
      message: 'Do you prefer trailing comma (which I do :P)?',
      name: 'trailingComma',
      type: 'list',
      choices: [{ name: 'a big yes!', value: 'es5' }, { name: 'nope..', value: 'none' }],
      default: 'es5',
    },
  ];
  return inquirer.prompt(queries);
}

async function getSettings({ envFromCli, useDefault }) {
  const env = envFromCli ? envFromCli.toUpperCase() : await queryEnv();

  if (useDefault) {
    const extendConfigs = extendChoices[constant[env]].default;
    const styleConfigs = {
      [constant.TAB_WIDTH]: 2,
      [constant.QUOTE]: 'single',
      [constant.TRAILING_COMMA]: 'es5',
    };
    return { env, extendConfigs, styleConfigs };
  }

  const extendConfigs = await queryExtends(env);
  const styleConfigs = await queryStyles(env);
  return { env, extendConfigs, styleConfigs };
}

(async function program() {
  commander
    .option('-e, --env <type>', 'program env: nodejs, react, vue')
    .option('-d, --default', 'use default setting suits without prompts')
    .option('--no-prettier', 'no prettier');
  commander.parse(process.argv);
  const { env: envFromCli, default: useDefault, prettier: usePrettier } = commander.opts();

  if (envFromCli !== undefined && !constant.ENV_MAP.includes(envFromCli.toUpperCase())) {
    console.log(
      chalk.red(`
    Unsupported env: ${envFromCli}.
    Program env should be one of: [nodejs, react, vue]'.
  `)
    );
    process.exit(1);
  }

  // 获取整个配置
  const { env, extendConfigs, styleConfigs } = await getSettings({ envFromCli, useDefault });
  debug('env', env);
  debug('extendConfigs', extendConfigs);
  debug('styleConfigs', styleConfigs);
  debug('usePrettier', usePrettier);
  // return;
  makeFile({ env, extendConfigs, styleConfigs, usePrettier });
})();
