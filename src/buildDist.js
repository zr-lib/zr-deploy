'use strict';

const { promisify } = require('util');
const ora = require('ora');
const chalk = require('chalk');
const { textError } = require('./utils/textConsole');
const spawnCommand = require('./utils/spawnCommand');

/**
 * 执行构建打包项目命令
 * @param {*} command 命令 string
 * @param {*} params 参数 array
 */
async function buildDist(command, params, next) {
  await spawnCommand(command, params)
    .then(() => {
      ora().succeed(chalk.green('打包完成！\n'));
      if (next) next();
    })
    .catch(() => {
      textError(`× 打包失败！[script: ${command} ${params}]\n`);
      process.exit(1);
    });
}

module.exports = promisify(buildDist);
