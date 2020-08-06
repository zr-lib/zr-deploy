'use strict';

const inquirer = require('inquirer');

/**
 * 选择部署环境
 * @param {*} CONFIG 配置文件内容
 */
function selectEnv(CONFIG) {
  const { selectConfig } = global.tips.en;

  return new Promise(async (resolve, reject) => {
    const select = await inquirer.prompt({
      type: 'list',
      name: selectConfig,
      choices: CONFIG.map((item, index) => ({
        name: `${item.server.name}`,
        value: index,
      })),
    });
    const selectServer = CONFIG[Object.values(select)[0]];
    if (selectServer) {
      resolve(selectServer);
    } else {
      reject();
    }
  });
}

module.exports = selectEnv;
