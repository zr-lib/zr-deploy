# zr-deploy

Web 前端项目部署脚本

## 前言

部署流程：（执行 `zr-deploy` 后）

- 选择部署环境 `配置文件 zr-deploy-config.json`
- 打包：执行配置文件的 `打包命令 buildCommand` 打包项目
- 压缩：打包完成后将文件压缩 `local.distDir -> local.distZip`
- 连接服务器：`node-ssh` 连接服务器
- 上传代码：上传文件到项目目录（`server.distDir`）
- `server.bakeup`
  - `true`: 备份旧的项目文件
  - `false`: 删除旧的项目文件
- 解压缩项目文件
- 部署成功

![预览图](https://s1.ax1x.com/2020/06/19/NMVyiF.gif)

已发布 `npm`，👉[zr-deploy](https://www.npmjs.com/package/zr-deploy)

源码 `github`，👉[zr-deploy](https://github.com/zero9527/zr-deploy)

## 使用

### 下载

> 注意 加 `-g`/`global` 下载到全局，不然会提示找不到命令！

> 这样也不用每个项目加这个依赖，只要进到项目目录下，添加配置文件后，执行 `zr-deploy` 就能部署了

```shell
npm i -g zr-deploy
```

或

```shell
yarn global add zr-deploy
```

然后在 **项目根目录** 新建配置文件 `zr-deploy-config.json`，

> 记住 加到 `.gitignore`，不要把它上传到 `github` 上面了

### 执行

进入项目目录

```shell
zr-deploy
```

### 配置文件

- `local`

  - `buildCommand`: 打包命令
  - `distDir`: 本地打包输出的路径
  - `distZip`: 压缩打包文件的文件名

- `server`
  - `name`: 选择的名字
  - `host`: 服务器 IP
  - `username`: 服务器的登录用户名
  - `password`: 对应用户名的密码
  - `distDir`: 项目路径
  - `distZipName`: 上传的压缩文件名
  - `bakeup`: 是否备份旧目录

`zr-deploy-config.json` 格式如下

```json
[
  {
    "local": {
      "buildCommand": "yarn build",
      "distDir": "./docs",
      "distZip": "./dist.zip"
    },
    "server": {
      "name": "服务器1",
      "host": "1.1.1.1",
      "username": "username",
      "password": "password",
      "distDir": "/var/www/xxx/xxx",
      "distZipName": "dist",
      "bakeup": false
    }
  },
  {
    "local": {
      "buildCommand": "yarn build",
      "distDir": "./docs",
      "distZip": "./dist.zip"
    },
    "server": {
      "name": "服务器2",
      "host": "2.2.2.2",
      "username": "username",
      "password": "password",
      "distDir": "/var/www/xxx/xxx",
      "distZipName": "dist",
      "bakeup": false
    }
  }
]
```

## 工具说明

### 目录结构

```
.
├── bin
|  └── zr-deploy.js
├── CHANGE_LOG.md
├── Desc.md
├── package-lock.json
├── package.json
├── README.md
├── README_zh.md
├── src
|  ├── buildDist.js
|  ├── compressDist.js
|  ├── deploy.js
|  ├── getConfig.js
|  ├── index.js
|  ├── selectEnv.js
|  └── utils
|     ├── getTime.js
|     └── textConsole.js
└── __test__
   └── index.test.js
```

### 部署脚本入口

```js
// src\index.js
'use strict';

/**
 * 前端自动部署项目脚本
 */
const { textTitle, textInfo } = require('./utils/textConsole');
const getConfig = require('./getConfig');
const selectEnv = require('./selectEnv');
const buildDist = require('./buildDist');
const compressDist = require('./compressDist');
const deploy = require('./deploy');

/* =================== 0、获取配置 =================== */

/* =================== 1、选择部署环境 =================== */

/* =================== 2、项目打包 =================== */

/* =================== 3、项目压缩 =================== */

/* =================== 4、连接服务器 =================== */

/* =================== 5、部署项目 =================== */

async function start() {
  const CONFIG = await selectEnv(getConfig());
  if (!CONFIG) process.exit(1);

  textTitle('======== 自动部署项目 ========');
  textInfo('');

  const [npm, ...script] = CONFIG.local.buildCommand.split(' ');

  // await buildDist('yarn', ['build']);
  await buildDist(npm, [...script]);
  await compressDist(CONFIG.local);
  await deploy(CONFIG.local, CONFIG.server);
  process.exit();
}

module.exports = start;
```

### 多个项目环境

使用 [inquirer](https://www.npmjs.com/package/inquirer)，从配置文件中选择

```js
// src\selectEnv.js
const inquirer = require('inquirer');

/**
 * 选择部署环境
 * @param {*} CONFIG 配置文件内容
 */
function selectEnv(CONFIG) {
  return new Promise(async (resolve, reject) => {
    const select = await inquirer.prompt({
      type: 'list',
      name: '选择部署的服务器',
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
```

### 压缩文件

```shell
yarn add zip-local
```

### 进度工具

```shell
yarn add ora
```

调用 `ora` 返回值的 `succeed`/`fail` 会替换原来的参数值（`loading`）

```js
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora(chalk.cyan('正在打包... \n')).start();
spinner.succeed(chalk.green('打包完成！\n'));
spinner.fail(chalk.red('打包失败！\n'));
```

### util.promisify

将`node.js` 内置函数转化为 `Promise` 形式， `promisify` 包装一下，方便使用 `async`/`await`，记住要调用一下 `next()`，相当于 `Promise.resolve()`，不然是不会走到下一步的

> 注意：普通函数（非 `node.js` 内置）使用 `promisify`，调用 `next`，不传参数没问题，传参数给 `next(arg)` 时，会走到 `catch` 去，跟 手动 `new Promise()` 对比一下，哪个方便使用哪个就是了

```js
const { promisify } = require('util');

async function buildDist(cmd, params, next) {
  // ...
  if (next) next();
}

module.exports = promisify(buildDist);
```

### ssh 连接服务器

使用 `node-ssh` 连接服务器

```shell
yarn add node-ssh
```

```js
// src\deploy.js
const node_ssh = require('node-ssh');

const SSH = new node_ssh();

/**
 * 连接服务器
 * @param {*} params { host, username, password }
 */
async function connectServer(params) {
  const spinner = ora(chalk.cyan('正在连接服务器...\n')).start();
  await SSH.connect(params)
    .then(() => {
      spinner.succeed(chalk.green('服务器连接成功！\n'));
    })
    .catch((err) => {
      spinner.fail(chalk.red('服务器连接失败！\n'));
      textError(err);
      process.exit(1);
    });
}

/**
 * 通过 ssh 在服务器上命令
 * @param {*} cmd shell 命令
 * @param {*} cwd 路径
 */
async function runCommand(cmd, cwd) {
  await SSH.execCommand(cmd, {
    cwd,
    onStderr(chunk) {
      textError(`${cmd}, stderrChunk, ${chunk.toString('utf8')}`);
    },
  });
}
```

## 打包代码 buildDist

可以用 `child_process.spawn` 执行 `shell` 命令 `npm/yarn build`

> `spawn` 的格式是 `child_process.spawn(command[, args][, options])`，以数组的形式传参

```js
// src\buildDist.js
'use strict';

const { promisify } = require('util');
const { spawn } = require('child_process');
const { textError, textSuccess } = require('./utils/textConsole');

/**
 * 执行脚本 spawn 的封装
 * @param {*} cmd
 * @param {*} params
 */
async function buildDist(cmd, params, next) {
  const build = spawn(cmd, params, {
    shell: process.platform === 'win32', // 兼容windows系统
    stdio: 'inherit', // 打印命令原始输出
  });

  build.on('error', () => {
    textError(`× [script: ${cmd} ${params}] 打包失败！\n`);
    process.exit(1);
  });

  build.on('close', (code) => {
    if (code === 0) {
      textSuccess('√ 打包完成！\n');
    } else {
      textError(`× 打包失败！[script: ${cmd} ${params}]\n`);
      process.exit(1);
    }
    // 必传，promisify 回调继续执行后续函数
    if (next) next();
  });
}

module.exports = promisify(buildDist);
```

## 压缩文件 compressDist

```js
// src\compressDist.js
'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const zipper = require('zip-local');
const { promisify } = require('util');
const { textError } = require('./utils/textConsole');

/**
 * 压缩打包好的项目
 * @param {*} LOCAL_CONFIG 本地配置
 * @param {*} next
 */
function compressDist(LOCAL_CONFIG, next) {
  try {
    const { distDir, distZip } = LOCAL_CONFIG;
    const dist = path.resolve(process.cwd(), distDir);
    if (!fs.existsSync(dist)) {
      textError('× 压缩失败');
      textError(`× 打包路径 [local.distDir] 配置错误，${dist} 不存在！\n`);
      process.exit(1);
    }

    const spinner = ora(chalk.cyan('正在压缩...\n')).start();

    zipper.sync.zip(dist).compress().save(path.resolve(process.cwd(), distZip));

    spinner.succeed(chalk.green('压缩完成！\n'));
    if (next) next();
  } catch (err) {
    textError('压缩失败！', err);
  }
}

module.exports = promisify(compressDist);
```

## 连接服务器、部署项目

```shell
yarn add node-ssh
```

### 连接成功后

- 上传代码
- 配置文件夹权限
- 备份原来的项目（`server.bakeup` 为 `true`）
- 删除原来的项目（`server.bakeup` 为 `false`）
- 解压缩上传的项目压缩文件
- 解压缩完成后，删除压缩文件
- 部署成功

```js
// src\deploy.js
'use strict';

const path = require('path');
const { promisify } = require('util');
const ora = require('ora');
const chalk = require('chalk');
const node_ssh = require('node-ssh');
const { textError, textInfo } = require('./utils/textConsole');
const getTime = require('./utils/getTime');

const SSH = new node_ssh();

/* =================== 3、连接服务器 =================== */
/**
 * 连接服务器
 * @param {*} params { host, username, password }
 */
async function connectServer(params) {
  const spinner = ora(chalk.cyan('正在连接服务器...\n')).start();
  await SSH.connect(params)
    .then(() => {
      spinner.succeed(chalk.green('服务器连接成功！\n'));
    })
    .catch((err) => {
      spinner.fail(chalk.red('服务器连接失败！\n'));
      textError(err);
      process.exit(1);
    });
}

/**
 * 通过 ssh 在服务器上命令
 * @param {*} cmd shell 命令
 * @param {*} cwd 路径
 */
async function runCommand(cmd, cwd) {
  await SSH.execCommand(cmd, {
    cwd,
    onStderr(chunk) {
      textError(`${cmd}, stderrChunk, ${chunk.toString('utf8')}`);
    },
  });
}

/* =================== 4、部署项目 =================== */
async function deploy(LOCAL_CONFIG, SERVER_CONFIG, next) {
  const {
    host,
    username,
    password,
    distDir,
    distZipName,
    bakeup,
  } = SERVER_CONFIG;

  if (!distZipName || distDir === '/') {
    textError('请正确配置zr-deploy-config.json!');
    process.exit(1);
  }

  // 连接服务器
  await connectServer({ host, username, password });
  // privateKey: '/home/steel/.ssh/id_rsa'

  const spinner = ora(chalk.cyan('正在部署项目...\n')).start();

  try {
    // 上传压缩的项目文件
    await SSH.putFile(
      path.resolve(process.cwd(), LOCAL_CONFIG.distZip),
      `${distDir}/${distZipName}.zip`
    );

    if (bakeup) {
      // 备份重命名原项目的文件
      await runCommand(
        `mv ${distZipName} ${distZipName}_${getTime()}`,
        distDir
      );
    } else {
      // 删除原项目的文件
      await runCommand(`rm -rf ${distZipName}`, distDir);
    }

    // 修改文件权限
    await runCommand(`chmod 777 ${distZipName}.zip`, distDir);

    // 解压缩上传的项目文件
    await runCommand(`unzip ./${distZipName}.zip -d ${distZipName}`, distDir);

    // 删除服务器上的压缩的项目文件
    await runCommand(`rm -rf ./${distZipName}.zip`, distDir);

    spinner.succeed(chalk.green('部署完成！\n'));
    textInfo(`项目路径: ${distDir}`);
    textInfo(new Date());
    textInfo('');
    if (next) next();
  } catch (err) {
    spinner.fail(chalk.red('项目部署失败！\n'));
    textError(`catch: ${err}`);
    process.exit(1);
  }
}

module.exports = promisify(deploy);
```

## 大功告成

没有意外的话，退出进程，然后就部署好了
