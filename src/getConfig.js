const fs = require('fs');
const { resolvePath } = require('./utils');
const { textInfo, textError } = require('./utils/textConsole');

// 获取配置
function getConfig(testConfigJSON = null) {
  const configFile = resolvePath(process.cwd(), './zr-deploy-config.json');
  if (!testConfigJSON && !fs.existsSync(configFile)) {
    textError(`${configFile} 不存在！`);
    textInfo(`请先在项目根目录新建"zr-deploy-config.json"，内容如下：
    [
      {
        "local": {
          "buildCommand": "yarn build",
          "distDir": "./docs",
          "distZip": "./dist.zip"
        },
        "server": {
          "name": "服务器1",
          "host": "1.1.1.1",
          "username": "username",
          "password": "password",
          "distDir": "/var/www/xxx/xxx",
          "distZipName": "dist",
          "bakeup": false
        }
      }
    ]
    `);
    process.exit(1);
  }
  let config = testConfigJSON || fs.readFileSync(configFile);
  try {
    config = JSON.parse(config);
    const localKeys = ['buildCommand', 'distDir', 'distZip'];
    const serverKeys = [
      'name',
      'host',
      'username',
      'password',
      'distDir',
      'distZipName',
      'bakeup',
    ];
    const someError = config.some((item) => {
      const configLocalKeys = Object.keys(item.local);
      const configServerKeys = Object.keys(item.server);
      const hasAllLocalKey = localKeys.every((item) =>
        configLocalKeys.includes(item)
      );
      const hasAllServerKey = serverKeys.every((item) =>
        configServerKeys.includes(item)
      );
      return !hasAllLocalKey || !hasAllServerKey;
    });
    if (someError) {
      textError('zr-deploy-config.json 配置不正确！\n');
      textInfo(
        `local需要的字段：{${localKeys.join(
          ', '
        )}}，server需要的字段：{${serverKeys.join(', ')}}\n`
      );
      process.exit(1);
    }
  } catch (err) {
    textError(err);
  }
  return config;
}

module.exports = getConfig;
