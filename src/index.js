'use strict';

/**
 * 自动部署项目
 */
const fs = require('fs');
const path = require('path');
const { textTitle, textInfo, textError } = require('./utils/textConsole');
const buildDist = require('./buildDist');
const compressDist = require('./compressDist');
const deploy = require('./deploy');

/* =================== 0、获取配置 =================== */
function getConfig() {
  const configFile = path.resolve(process.cwd(), './zr-deploy-config.json');
  if (!fs.existsSync(configFile)) {
    textError(`${configFile} 不存在！`);
    textInfo(`请先在项目根目录新建"zr-deploy-config.json"，内容如下：
    {
      "local": {
        "distDir": "./docs",
        "distZip": "./dist.zip"
      },
      "server": {
        "host": "服务器IP",
        "username": "服务器用户名",
        "password": "对应用户名的密码",
        "distDir": "项目路径",
        "distZipName": "上传的压缩文件名"
      }
    }`);
    process.exit(1);
  }
  let config = fs.readFileSync(configFile);
  if (config) config = JSON.parse(config);
  else {
    textError('zr-deploy-config.json 配置不正确！');
    process.exit(1);
  }
  return config;
}
/* =================== 1、项目打包 =================== */

/* =================== 2、项目压缩 =================== */

/* =================== 3、连接服务器 =================== */

/* =================== 4、部署项目 =================== */

/**
 * promisfy 会自动给包裹的函数添加一个参数，next，作为后续执行的回调
 */

async function start() {
  const CONFIG = getConfig();
  textTitle('======== 自动部署项目 ========');
  textInfo('');

  // 部署环境，选择
  // 备份服务器上旧项目文件，选择

  await buildDist('yarn', ['build']);
  await compressDist(CONFIG.local);
  await deploy(CONFIG.local, CONFIG.server);
  process.exit();
}

module.exports = start;
