'use strict';

const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const zipper = require('zip-local');
const { promisify } = require('util');
const { resolvePath, getTips } = require('./utils');
const { textError } = require('./utils/textConsole');

/**
 * 压缩打包好的项目
 * @param {*} LOCAL_CONFIG 本地配置
 * @param {*} next
 */
function compressDist(LOCAL_CONFIG, next) {
  try {
    const { distDir, distZip } = LOCAL_CONFIG;
    const dist = resolvePath(process.cwd(), distDir);

    if (!fs.existsSync(dist)) {
      textError(`× ${getTips('compressFailed')}`);
      textError(
        `× ${getTips('buildDist')} [local.distDir] ${getTips(
          'configIncorrect'
        )} ${dist} ${getTips('notExist')}\n`
      );
      process.exit(1);
    }

    const spinner = ora(chalk.cyan(`${getTips('compressing')}...\n`)).start();

    zipper.sync.zip(dist).compress().save(resolvePath(process.cwd(), distZip));

    spinner.succeed(chalk.green(`${getTips('compressSuccess')}\n`));
    if (next) next();
  } catch (err) {
    textError(`${getTips('compressFailed')}`, err);
  }
}

module.exports = promisify(compressDist);
