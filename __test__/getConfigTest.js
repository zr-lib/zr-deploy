const fs = require('fs');
const getConfig = require('../src/getConfig');
const { resolvePath } = require('../src/utils');

// 获取配置测试
function getConfigTest() {
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

  it('[==== getConfig -- testing ====]', () => {
    const configFile = fs.readFileSync(
      resolvePath(__dirname, './zr-deploy-config.json')
    );
    const langs = Object.keys(global.tips);
    const config = getConfig(configFile);

    global.tipsLang = config[0].local.tipsLang
      ? langs.includes(config[0].local.tipsLang)
        ? config[0].local.tipsLang
        : 'en'
      : 'zh';

    const configLocalKeys = Object.keys(config[0].local);
    const configServerKeys = Object.keys(config[0].server);
    // has all keys
    expect(localKeys.every((key) => configLocalKeys.includes(key))).toBe(true);
    expect(serverKeys.every((key) => configServerKeys.includes(key))).toBe(
      true
    );
    // all keys has it's value
    expect(Object.values(config[0].local).every(Boolean)).toBe(true);
    expect(
      configServerKeys.every((key) => {
        if (key === 'bakeup') return true;
        else return Boolean(config[0].server[key]);
      })
    ).toBe(true);
    // get key's value
    expect(config[0].local.buildCommand).toEqual('mkdir testDist');
  });
}

module.exports = getConfigTest;
