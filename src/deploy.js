'use strict';

const { promisify } = require('util');
const ora = require('ora');
const chalk = require('chalk');
const node_ssh = require('node-ssh');
const { resolvePath, getTime } = require('./utils');
const { textError, textInfo } = require('./utils/textConsole');

const SSH = new node_ssh();

/* =================== 3、连接服务器 =================== */
/**
 * 连接服务器
 * @param {*} params { host, username, password }
 */
async function connectServer(params) {
  const {
    connectingServer,
    connectedServer,
    connectServerFailed,
  } = global.tips[global.tipsLang];

  const spinner = ora(chalk.cyan(`${connectingServer}...\n`)).start();

  await SSH.connect(params)
    .then(() => {
      spinner.succeed(chalk.green(`${connectedServer}\n`));
    })
    .catch((err) => {
      spinner.fail(chalk.red(`${connectServerFailed}\n`));
      textError(err);
      process.exit(1);
    });
}

/**
 * 通过 ssh 在服务器上命令
 * @param {*} cmd shell 命令
 * @param {*} cwd 路径
 */
async function runCommand(cmd, cwd) {
  await SSH.execCommand(cmd, {
    cwd,
    onStderr(chunk) {
      textError(`${cmd}, stderrChunk, ${chunk.toString('utf8')}`);
    },
  });
}

/* =================== 4、部署项目 =================== */
async function deploy(LOCAL_CONFIG, SERVER_CONFIG, next) {
  const {
    configIncorrect,
    distDirRule,
    deploying,
    deploySuccess,
    deployFailed,
    projectPath,
  } = global.tips[global.tipsLang];

  const {
    host,
    username,
    password,
    distDir,
    distZipName,
    bakeup,
  } = SERVER_CONFIG;

  if (!host || !username || !password || !distDir || !distZipName) {
    textError(`zr-deploy-config.json ${configIncorrect}`);
    process.exit(1);
  }
  if (!distDir.startsWith('/') || distDir === '/') {
    textError(`[server.distDir: ${distDir}] ${distDirRule}`);
    process.exit(1);
  }

  // 连接服务器
  await connectServer({ host, username, password });
  // privateKey: '/home/steel/.ssh/id_rsa'

  const spinner = ora(chalk.cyan(`${deploying}...\n`)).start();

  try {
    // 上传压缩的项目文件
    await SSH.putFile(
      resolvePath(process.cwd(), LOCAL_CONFIG.distZip),
      `${distDir}/${distZipName}.zip`
    );

    if (bakeup) {
      // 备份重命名原项目的文件
      await runCommand(
        `mv ${distZipName} ${distZipName}_${getTime()}`,
        distDir
      );
    } else {
      // 删除原项目的文件
      await runCommand(`rm -rf ${distZipName}`, distDir);
    }

    // 修改文件权限
    await runCommand(`chmod 777 ${distZipName}.zip`, distDir);

    // 解压缩上传的项目文件
    await runCommand(`unzip ./${distZipName}.zip -d ${distZipName}`, distDir);

    // 删除服务器上的压缩的项目文件
    await runCommand(`rm -rf ./${distZipName}.zip`, distDir);

    spinner.succeed(chalk.green(`${deploySuccess}\n`));
    textInfo(`${projectPath} ${distDir}`);
    textInfo(new Date());
    textInfo('');
    if (next) next();
  } catch (err) {
    spinner.fail(chalk.red(`${deployFailed}\n`));
    textError(`catch: ${err}`);
    process.exit(1);
  }
}

module.exports = promisify(deploy);
