const fs = require('fs');
const compressDist = require('../src/compressDist');
const testConfig = require('./zr-deploy-config.json');
const { resolvePath } = require('../src/utils');

function compressDistTest() {
  describe('[==== compressDist -- testing ====]', () => {
    test('', () => {
      const LOCAL_CONFIG = testConfig[0].local;
      compressDist(LOCAL_CONFIG);

      // zip file
      const zipFile = resolvePath(__dirname, `../${LOCAL_CONFIG.distZip}`);
      expect(fs.existsSync(zipFile)).toBe(true);
    });
  });
}

module.exports = compressDistTest;
