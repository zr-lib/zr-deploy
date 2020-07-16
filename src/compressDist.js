'use strict';

const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const zipper = require('zip-local');
const { promisify } = require('util');
const { resolvePath } = require('./utils');
const { textError } = require('./utils/textConsole');

/**
 * 压缩打包好的项目
 * @param {*} LOCAL_CONFIG 本地配置
 * @param {*} next
 */
function compressDist(LOCAL_CONFIG, next) {
  try {
    const {
      compressFailed,
      buildDist,
      configIncorrect,
      notExist,
      compressing,
      compressSuccess,
    } = global.tips[global.tipsLang];
    const { distDir, distZip } = LOCAL_CONFIG;
    const dist = resolvePath(process.cwd(), distDir);

    if (!fs.existsSync(dist)) {
      textError(`× ${compressFailed}`);
      textError(
        `× ${buildDist} [local.distDir] ${configIncorrect} ${dist} ${notExist}\n`
      );
      process.exit(1);
    }

    const spinner = ora(chalk.cyan(`${compressing}...\n`)).start();

    zipper.sync.zip(dist).compress().save(resolvePath(process.cwd(), distZip));

    spinner.succeed(chalk.green(`${compressSuccess}\n`));
    if (next) next();
  } catch (err) {
    textError(`${compressFailed}`, err);
  }
}

module.exports = promisify(compressDist);
