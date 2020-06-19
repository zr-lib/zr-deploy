/**
 * 获取时间
 * @returns 2020-6-19_00:00:00
 */
module.exports = function getTime() {
  return new Date().toLocaleString().replace(' ', '_');
};
