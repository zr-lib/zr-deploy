# zr-deploy
中文 | [英文](./README.md)

Web前端Spa项目，自动部署脚本


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

- tipsLang: 可选，值：`en` | `zh`；默认 `zh`

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
