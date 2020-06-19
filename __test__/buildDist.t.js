const fs = require('fs');
const getConfig = require('../src/getConfig');
const buildDist = require('../src/buildDist');
const { resolvePath } = require('../src/utils');

function buildDistTest() {
  describe('[==== buildDistTest -- testing ====]', async () => {
    const configFile = fs.readFileSync(
      resolvePath(__dirname, './zr-deploy-config.json')
    );
    const config = await getConfig(configFile);

    const [npm, ...script] = config[0].local.buildCommand.split(' ');
    await buildDist(npm, [...script]);
  });
}

module.exports = buildDistTest;
