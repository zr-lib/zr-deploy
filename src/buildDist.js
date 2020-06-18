'use strict';

const { promisify } = require('util');
const { spawn } = require('child_process');
const { textError, textSuccess } = require('./utils/textConsole');

/**
 * 执行脚本 spawn 的封装
 * @param {*} cmd
 * @param {*} params
 */
async function buildDist(cmd, params, next) {
  const build = spawn(cmd, params, {
    shell: process.platform === 'win32', // 兼容windows系统
    stdio: 'inherit', // 打印命令原始输出
  });

  build.on('error', () => {
    textError(`× [script: ${cmd} ${params}] 打包失败！\n`);
    process.exit(1);
  });

  build.on('close', (code) => {
    if (code === 0) {
      textSuccess('√ 打包完成！\n');
    } else {
      textError(`× [script: ${cmd} ${params}] 打包失败！\n`);
      process.exit(1);
    }
    // 必传，promisify 回调继续执行后续函数
    if (next) next();
  });
}

module.exports = promisify(buildDist);
