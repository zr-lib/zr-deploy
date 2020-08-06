'use strict';

const path = require('path');

/**
 * 路径解析
 * @param {*} _path
 * @param {*} _file
 */
exports.resolvePath = (_path, _file) => path.resolve(_path, _file);

/**
 * 获取时间
 * @returns 2020-6-19_00-00-00
 */
exports.getTime = function getTime() {
  const _Date = new Date();
  const date = _Date.toLocaleDateString();
  const time = _Date.toTimeString().split(' ')[0].replace(/\:/g, '-');
  return `${date}_${time}`;
};

/**
 * 打印提示
 * @param {*} name tips name
 */
exports.getTips = function (name) {
  const langConfig = global.tips[global.tipsLang];
  if (langConfig) return langConfig[name];
  return global.tips.en[name];
};
