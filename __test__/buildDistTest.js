const fs = require('fs');
const getConfig = require('../src/getConfig');
const buildDist = require('../src/buildDist');
const { resolvePath } = require('../src/utils');

// 打包测试
function buildDistTest() {
  it('[==== buildDistTest -- testing ====]', async () => {
    const configFile = fs.readFileSync(
      resolvePath(__dirname, './zr-deploy-config.json')
    );
    const config = await getConfig(configFile);

    const testDistDir = resolvePath(__dirname, '../testDist');
    if (fs.existsSync(testDistDir)) fs.rmdirSync(testDistDir);

    const buildCommand = config[0].local.buildCommand;
    const [npm, ...script] = buildCommand.split(' ');
    await buildDist(npm, [...script]);

    const testDistZip = resolvePath(__dirname, '../testDist.zip');
    if (fs.existsSync(testDistZip)) fs.unlinkSync(testDistZip);
  });
}

module.exports = buildDistTest;
