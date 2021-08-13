'use strict';

const { promisify } = require('util');
const ora = require('ora');
const chalk = require('chalk');
const node_ssh = require('node-ssh');
const { resolvePath, getTime, getTips } = require('./utils');
const { textError, textInfo } = require('./utils/textConsole');

const SSH = new node_ssh();

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

/* =================== 3、连接服务器 =================== */
/**
 * 连接服务器
 * @param {*} params { host, port, username, password }
 */
async function connectServer(params) {
  const spinner = ora(
    chalk.cyan(`${getTips('connectingServer')}...\n`)
  ).start();

  await SSH.connect(params)
    .then(() => {
      spinner.succeed(chalk.green(`${getTips('connectedServer')}\n`));
    })
    .catch((err) => {
      spinner.fail(chalk.red(`${getTips('connectServerFailed')}\n`));
      textError(err);
      process.exit(1);
    });
}

/* =================== 4、部署项目 =================== */
async function deploy(LOCAL_CONFIG, SERVER_CONFIG, next) {
  const {
    host,
    port,
    username,
    password,
    distDir,
    distZipName,
    bakeup,
  } = SERVER_CONFIG;

  if (!host || !username || !password || !distDir || !distZipName) {
    textError(`zr-deploy-config.json ${getTips('configIncorrect')}`);
    process.exit(1);
  }
  if (!distDir.startsWith('/') || distDir === '/') {
    textError(`[server.distDir: ${distDir}] ${getTips('distDirRule')}`);
    process.exit(1);
  }

  // privateKey: '/home/steel/.ssh/id_rsa'
  // 连接服务器
  await connectServer({ host, port, username, password });

  const spinner = ora(chalk.cyan(`${getTips('deploying')}...\n`)).start();

  try {
    // 上传压缩的项目文件
    await SSH.putFile(
      resolvePath(process.cwd(), LOCAL_CONFIG.distZip),
      `${distDir}/${distZipName}.zip`
    ).catch(err => {
      console.log('[error]putFile: ', err);
    });

    if (bakeup) {
      // 备份重命名原项目的文件
      await runCommand(
        `mv ${distZipName} ${distZipName}_${getTime()}`,
        distDir
      );
    } else {
      // 删除原项目的文件
      await runCommand(`rm -rf ${distZipName}`, distDir)
        .catch(err => {
          console.log('[error]rmOldFile: ', err);
        });
    }

    // 修改文件权限
    await runCommand(`chmod 777 ${distZipName}.zip`, distDir)
      .catch(err => {
        console.log('[error]chmod: ', err);
      });

    // 解压缩上传的项目文件
    await runCommand(`unzip ./${distZipName}.zip -d ${distZipName}`, distDir)
      .catch(err => {
        console.log('[error]unzip: ', err);
      });

    // 删除服务器上的压缩的项目文件
    await runCommand(`rm -rf ./${distZipName}.zip`, distDir)
      .catch(err => {
        console.log('[error]rmzip: ', err);
      });

    spinner.succeed(chalk.green(`${getTips('deploySuccess')}\n`));

    await SSH.dispose();

    textInfo(`${getTips('projectPath')} ${distDir}`);
    textInfo(new Date());
    textInfo('');
    if (next) next();
  } catch (err) {
    spinner.fail(chalk.red(`${getTips('deployFailed')}\n`));
    textError(`catch: ${err}`);
    process.exit(1);
  }
}

module.exports = promisify(deploy);
