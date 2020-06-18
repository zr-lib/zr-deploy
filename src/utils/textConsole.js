'use strict';

const chalk = require('chalk');

/**
 * 打印提示
 */
const textNormal = text => console.log(text);
const textTitle = text => console.log(chalk.bgCyan(chalk.black(text)));
const textInfo = text => console.log(chalk.cyan(text));
const textSuccess = text => console.log(chalk.green(text));
const textError = text => console.log(chalk.red(text));

module.exports = {
  textTitle,
  textNormal,
  textSuccess,
  textError,
  textInfo
};
