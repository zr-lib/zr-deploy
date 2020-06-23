const getConfigTest = require('./getConfigTest');
const buildDistTest = require('./buildDistTest');
const compressDistTest = require('./compressDistTest');

describe('[===== zr-deploy -- testing =====]', () => {
  getConfigTest();
  buildDistTest();
  compressDistTest();
});
