'use strict';

const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const zipper = require('zip-local');
const { promisify } = require('util');
const { textError } = require('./utils/textConsole');

// 压缩打包好的项目
function compressDist(LOCAL_CONFIG, next) {
  const spinner = ora(chalk.cyan('正在压缩...\n')).start();

  try {
    const { distDir, distZip } = LOCAL_CONFIG;

    zipper.sync
      .zip(path.resolve(process.cwd(), distDir))
      .compress()
      .save(path.resolve(process.cwd(), distZip));

    spinner.succeed(chalk.green('压缩完成！\n'));
    if (next) next();
  } catch (err) {
    textError('压缩失败！', err);
  }
}

module.exports = promisify(compressDist);
