const path = require('path');
const { resolvePath, getTime } = require('../src/utils');

describe('[===== utils testing =====]', () => {
  it('getTime test', () => {
    const _Date = new Date();
    const _time = getTime();
    const [_date, time] = _time.split('_');

    const [year, month, date] = _date.split('-');
    expect(Number(year)).toEqual(_Date.getFullYear());
    expect(Number(month)).toEqual(_Date.getMonth() + 1);
    expect(Number(date)).toEqual(_Date.getDate());

    const [hour, minute, second] = time.split('-');
    expect(Number(hour)).toEqual(_Date.getHours());
    expect(Number(minute)).toEqual(_Date.getMinutes());
    expect(Number(second)).toEqual(_Date.getSeconds());
  });

  it('resolvePath test', () => {
    const path_resolve = path.resolve(__dirname, './utils.test.js');
    const resolve_path = resolvePath(__dirname, './utils.test.js');
    expect(path_resolve === resolve_path).toBe(true);
  });
});
