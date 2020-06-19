const fs = require('fs');
const getConfig = require('../src/getConfig');
const { resolvePath } = require('../src/utils');

function getConfigTest() {
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

  describe('[==== getConfig -- testing ====]', () => {
    test('test: correct config', () => {
      const configFile = fs.readFileSync(
        resolvePath(__dirname, './zr-deploy-config.json')
      );
      const config = getConfig(configFile);

      const configLocalKeys = Object.keys(config[0].local);
      const configServerKeys = Object.keys(config[0].server);
      // has all keys
      expect(localKeys.every((key) => configLocalKeys.includes(key))).toBe(
        true
      );
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
      expect(config[0].local.buildCommand).toEqual('mkdir ../testDist');
    });
  });
}

module.exports = getConfigTest;
