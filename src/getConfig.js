const fs = require('fs');
const path = require('path');
const { textInfo, textError } = require('./utils/textConsole');

// 获取配置
function getConfig() {
  const configFile = path.resolve(process.cwd(), './zr-deploy-config.json');
  if (!fs.existsSync(configFile)) {
    textError(`${configFile} 不存在！`);
    textInfo(`请先在项目根目录新建"zr-deploy-config.json"，内容如下：
    {
      "local": {
        "buildCommand": "yarn build",
        "distDir": "./docs",
        "distZip": "./dist.zip"
      },
      "servers": [
        {
          "serverName": "服务器1",
          "host": "服务器IP",
          "username": "服务器用户名",
          "password": "对应用户名的密码",
          "distDir": "项目路径",
          "distZipName": "上传的压缩文件名"
        }
      ]
    }`);
    process.exit(1);
  }
  let config = fs.readFileSync(configFile);
  try {
    config = JSON.parse(config);
    if (!config.local.buildCommand) {
      textError(
        `"buildCommand: ${config.local.buildCommand}"不正确，例："yarn build"`
      );
      process.exit(1);
    } else if (!config) {
      textError('zr-deploy-config.json 配置不正确！');
      process.exit(1);
    }
  } catch (err) {
    textError(err);
  }
  return config;
}

module.exports = getConfig;
