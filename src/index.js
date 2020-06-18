'use strict';

/**
 * 自动部署项目
 */
const { textTitle, textInfo } = require('./utils/textConsole');
const getConfig = require('./getConfig');
const selectEnv = require('./selectEnv');
const buildDist = require('./buildDist');
const compressDist = require('./compressDist');
const deploy = require('./deploy');

/* =================== 0、获取配置 =================== */

/* =================== 1、选择部署环境 =================== */

/* =================== 2、项目打包 =================== */

/* =================== 3、项目压缩 =================== */

/* =================== 4、连接服务器 =================== */

/* =================== 5、部署项目 =================== */

async function start() {
  const CONFIG = await selectEnv(getConfig())
    .then((res) => {
      console.log('res: ', res);
    })
    .catch((err) => {
      console.error('err: ', err);
    });
  console.log('selectEnv: ', CONFIG);
  if (!CONFIG) {
    process.exit(1);
  }
  textTitle('======== 自动部署项目 ========');
  textInfo('');

  // 部署环境，选择
  // 备份服务器上旧项目文件，选择

  const [npm, ...script] = CONFIG.local.buildCommand.split(' ');

  // await buildDist('yarn', ['build']);
  await buildDist(npm, [...script]);
  await compressDist(CONFIG.local);
  await deploy(CONFIG.local, CONFIG.server);
  process.exit();
}

module.exports = start;
