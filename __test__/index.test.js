const getConfigTest = require('./getConfigTest');
const buildDistTest = require('./buildDistTest');
const compressDistTest = require('./compressDistTest');
const tips = require('../src/tips');

global.tips = tips;
global.tipsLang = 'zh';

describe('[===== zr-deploy -- testing =====]', () => {
  getConfigTest();
  buildDistTest();
  compressDistTest();
});
