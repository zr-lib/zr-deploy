'use strict';

const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const zipper = require('zip-local');
const { promisify } = require('util');
const { textError } = require('./utils/textConsole');
const { existsSync } = require('fs');

// 压缩打包好的项目
function compressDist(LOCAL_CONFIG, next) {
  try {
    const { distDir, distZip } = LOCAL_CONFIG;
    const dist = path.resolve(process.cwd(), distDir);
    if (!existsSync(dist)) {
      textError('× 压缩失败');
      textError(`× 打包路径 [local.distDir] 配置错误，${dist} 不存在！\n`);
      process.exit(1);
    }

    const spinner = ora(chalk.cyan('正在压缩...\n')).start();

    zipper.sync.zip(dist).compress().save(path.resolve(process.cwd(), distZip));

    spinner.succeed(chalk.green('压缩完成！\n'));
    if (next) next();
  } catch (err) {
    textError('压缩失败！', err);
  }
}

module.exports = promisify(compressDist);
