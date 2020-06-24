const { spawn } = require('child_process');

/**
 * spawnCommand 执行shell命令
 * @param {*} command 命令 string
 * @param {*} params 参数 array
 * @param {*} cwd 工作路径
 * @example spawnCommand('yarn', ['build'], process.cwd())
 */
const spawnCommand = (command, params, cwd) => {
  return new Promise((resolve, reject) => {
    const result = spawn(command, params, {
      cwd,
      stdio: 'inherit', // 打印命令原始输出
      shell: process.platform === 'win32', // 兼容windows系统
    });

    result.on('error', (err) => {
      reject(err);
    });

    result.on('close', (code) => {
      if (code === 0) resolve();
      else reject(code);
    });
  });
};

module.exports = spawnCommand;
