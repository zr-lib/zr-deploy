const { promisify } = require('util');
const inquirer = require('inquirer');

// 选择部署环境
async function selectEnv(CONFIG, next) {
  console.log(CONFIG);
  const choices = CONFIG.servers.map((item, index) => ({
    name: `${item.serverName} ${item.host}`,
    value: index,
  }));
  const select = await inquirer.prompt({
    name: '选择部署的服务器',
    choices,
    type: 'list',
  });
  const selectServer = CONFIG.servers[Object.values(select)[0]];
  console.log('selectServer: ', selectServer);

  const realConfig = { local: CONFIG.local, server: selectServer };
  if (next) next(realConfig);
}

module.exports = promisify(selectEnv);
