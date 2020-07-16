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
  const { buildSuccess, buildFailed } = global.tips[global.tipsLang];
  await spawnCommand(command, params)
    .then(() => {
      // 空换行
      console.log('');
      ora().succeed(chalk.green(`${buildSuccess}\n`));
      if (next) next();
    })
    .catch(() => {
      textError(`× ${buildFailed}[script: ${command} ${params}]\n`);
      process.exit(1);
    });
}

module.exports = promisify(buildDist);
