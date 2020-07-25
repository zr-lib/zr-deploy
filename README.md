# zr-deploy

[中文](./README_zh.md) | English

Web FrontEnd Spa, deploy script

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

- tipsLang: opntional, value: `en` | `zh`; default `zh`

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
