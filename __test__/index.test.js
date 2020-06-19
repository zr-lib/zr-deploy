const getConfigTest = require('./getConfig.t');
const buildDistTest = require('./buildDist.t');
const compressDistTest = require('./compressDist.t');

async function testStart() {
  await getConfigTest();
  await buildDistTest();
  // await compressDistTest();
}

testStart();
