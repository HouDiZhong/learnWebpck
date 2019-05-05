## 安装webpack webpack-cli webpack-dev-server
```
yarn add webpack webpack-cli webpack-dev-server -D








```

## loader 类型
```
内联loader 
yran add expose-loader -D  // 安装
// 作用是将$暴露到window上（写法一）
import $ from 'expose-loader?$!jquery'; 
（写法二）
在webpack.config.js 
{
	test: require.resolve('jquery'),
	use: 'exopse-loader?$'
}


normal loader
{
	test: /\.js$/,
	use: 'babel-loader'
}

后置 loader
{
	test: /\.js$/,
	use: {
		loader: 'babel-loader',
		enforce: 'post' 
	}
}

前置 loader 

{
	test: /\.js$/,
	use: {
		loader: 'babel-loader',
		enforce: 'per' 
	}
}
```

## 跨域三板斧
```
1、2 webpack.config.js 
// 1) 代理服务器
devServer: {
	proxy: {
		'/api': 'http://localhost:3000', // 1
		// 1跟2不可同时写
		'/api': { // 2  
			target: 'http://localhost:3000',
			pathRewrite: {'/api','' }
		}
	}
}
// 2) 模拟数据
devServer: {
	before(app) { // 钩子函数在请求之前触发
		app.get('/user',(req,res) => {
			res.json({'返回数据': '数据'})
		})
	}
}
// 3) 在服务器端启动webpack，需安装插件 webpack-dev-middleware
yarn add webpack-dev-middleware -D

const express = require('express');
const app = express();
const webpack = require('webpack');
 
// 中间件
const middle = require('webpack-dev-middleware');
const config = require('./webpack.config.js');

const compiler = webpack(config); // webpack运行结果

app.use(middle(compiler));

app.listen(3000);

```
































````
{
  "compilerOptions": {
    "target": "es2017",
    "allowSyntheticDefaultImports": false,
    "baseUrl": "./",
    "paths": {
      "@actions/*": ["src/actions/*"],
      "@components/*": ["src/components/"],
      "@commonComp/*": ["src/components/common/"],
      "@common/*": ["src/common/*"],
      "@reducers/*": ["src/reducers/*"],
      "@images/*": ["src/images/*"],
      "@lib/*": ["src/lib/*"],
      "@assets/*": ["src/assets/*"],
      "@util/*": ["src/utility/*"],
      "config/*": ["src/config/*"],
      "sources/*": ["src/sources/*"],
      "stores/*": ["src/stores/*"],
      "styles/*": ["src/styles/*"]
    }
  },
  "exclude": ["node_modules", "dist"],
  "include": ["src"]
}
````