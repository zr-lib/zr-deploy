# zr-deploy

[中文](./README_zh.md) | English

Web FrontEnd Spa, deploy script

> In fact, as long as it is an npm project (with package.json), it can generally be used

## Install

```shell
npm i -g zr-deploy
```

## Run

cd project directory

```shell
zr-deploy
```

## zr-deploy-config.json

- `local`

  - `buildCommand`: command in "scripts" in `package.json`
  - `distDir`: build output path
  - `distZip`: build output file/folder zip
  - `tipsLang`: opntional, value: `en` | `zh`; use `zh` when not provide

* `server`

  - `name`: name
  - `host`: server IP
  - `username`: server login username
  - `password`: server login password
  - `distDir`: server preject path
  - `distZipName`: zip filename of upload
  - `bakeup`: bakeup or not

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

## Description

[Description.md](./Description.md)
