'use strict';

const fs = require('fs');
const { resolvePath, getTips } = require('./utils');
const { textInfo, textError } = require('./utils/textConsole');

// 获取配置
function getConfig(testConfigJSON = null) {
  const configFile = resolvePath(process.cwd(), './zr-deploy-config.json');
  if (!testConfigJSON && !fs.existsSync(configFile)) {
    textError(`${configFile} ${getTips('notExist')}`);
    textInfo(`${getTips('addConfigJson')}
    [
      {
        "local": {
          "buildCommand": "yarn build",
          "distDir": "./dist",
          "distZip": "./dist.zip"
        },
        "server": {
          "name": "server1",
          "host": "1.1.1.1",
          "port": "22",
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
      'port',
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
      textError(`zr-deploy-config.json ${getTips('configIncorrect')}\n`);
      textInfo(
        `local${getTips('needKeys')}{${localKeys.join(', ')}}，server${getTips(
          'needKeys'
        )}{${serverKeys.join(', ')}}\n`
      );
      process.exit(1);
    }
  } catch (err) {
    textError(err);
  }
  return config;
}

module.exports = getConfig;
