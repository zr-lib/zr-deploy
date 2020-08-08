# Node.js 项目配置 eslint
通过 `eslint` 去检查一些低级错误，可以：
- 减少查错成本；
- 设置特点规则，也可以规范代码风格


## 下载依赖
最好加上 `babel-eslint`，这样使用一些 `ES6+` 的功能如 `async/await` 等不会报错

```shell
yarn add -D eslint babel-eslint
```


## 配置文件 .eslintrc

```json
{
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    "eqeqeq": ["error"],
    "no-undef": ["error"],
    "quotes": ["warn", "single"],
    "semi": ["warn", "always"],
    "no-unused-vars": ["error"]
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6
  }
}
```


## 忽略文件 .eslintignore
纯文本，忽略一些不想检查的文件/文件夹，如测试文件夹 `__test__` 等

```
__test__/*
```
