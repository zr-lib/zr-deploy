/**
 * 获取时间
 * @returns 2020-6-19_00-00-00
 */
module.exports = function getTime() {
  const _Date = new Date();
  const date = _Date.toLocaleDateString();
  const time = _Date.toTimeString().split(' ')[0].replace(/\:/g, '-');
  return `${date}_${time}`;
};
