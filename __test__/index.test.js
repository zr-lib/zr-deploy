const getConfigTest = require('./getConfigTest');
const buildDistTest = require('./buildDistTest');
const compressDistTest = require('./compressDistTest');
const tips = require('../src/tips');

global.tips = tips;

describe('[===== zr-deploy -- testing =====]', () => {
  getConfigTest();
  buildDistTest();
  compressDistTest();
});
