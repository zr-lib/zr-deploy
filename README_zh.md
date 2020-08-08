# zr-deploy

中文 | [English](./README.md)

Web 前端 Spa 项目，自动部署脚本

> 其实，只要是 npm 项目（有 package.json），一般都能用

## 下载

```shell
npm i -g zr-deploy
```

## 执行

进入项目目录下

```shell
zr-deploy
```

## zr-deploy-config.json

- `local`

  - `buildCommand`: 在 `package.json` "scripts" 中的打包命令
  - `distDir`: 本地打包输出的路径
  - `distZip`: 压缩打包文件的文件名
  - `tipsLang`: 可选，值：`en` | `zh`；不提供时默认 `zh`

* `server`

  - `name`: 选择的名字
  - `host`: 服务器 IP
  - `username`: 服务器的登录用户名
  - `password`: 对应用户名的密码
  - `distDir`: 项目路径
  - `distZipName`: 上传的压缩文件名
  - `bakeup`: 是否备份旧目录

```json
[
  {
    "local": {
      "buildCommand": "yarn build",
      "distDir": "./docs",
      "distZip": "./docs.zip",
      "tipsLang": "en"
    },
    "server": {
      "name": "server1",
      "host": "1.1.1.1",
      "username": "username",
      "password": "password",
      "distDir": "/var/www/xxx/xxx",
      "distZipName": "dist",
      "bakeup": false
    }
  }
]
```

## 说明

[Description.md](./Description.md)
