'use strict';

const ora = require('ora');
const chalk = require('chalk');
const { promisify } = require('util');
const { spawn } = require('child_process');
const { textError } = require('./utils/textConsole');

/**
 * 执行脚本 spawn 的封装
 * @param {*} cmd
 * @param {*} params
 */
async function buildDist(cmd, params, next) {
  const build = spawn(cmd, params, {
    shell: process.platform === 'win32', // 兼容windows系统
  });

  const spinner = ora(chalk.cyan('正在打包... \n')).start();

  build.on('error', (code) => {
    spinner.fail(chalk.red('打包失败！\n'));
    textError(`build process close all stdio with code ${code}`);
    process.exit(1);
  });

  build.on('close', (code) => {
    spinner.succeed(chalk.green('打包完成！\n'));
    if (code !== 0) {
      textError(`build process exited with code ${code}`);
    }
    // 必传，promisify 回调继续执行后续函数
    if (next) next();
  });
}

module.exports = promisify(buildDist);
