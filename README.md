### bitSandBox 

live demo: https://f-one-1.github.io/bitSandBox/

#### 相关
- 技术栈Vue
- 实现目标 在 Vue 应用 Sandbox 里运行 React 代码


#### 需要解决的问题

#### 1. 如何让代码在浏览器内运行

- 浏览器不支持直接 import NPM 模块
- 浏览器无法识别 React 的 JSX 语法

虽然最新浏览器 (Chrome 67 版本开始) 已支持 ESM 模块的加载方式，但需要有以下两个前提条件：

条件 1：需要对源代码进行改造，改为相对或绝对路径，比如：import React from 'react' 改成 import React from '/@module/react'

条件 2：需要本地启动服务器端 Server，返回对应代码内容

当 import 其他文件时，比 import App from './App.jsx' ，因为 import 是系统关键词，我们无法直接模拟或者代理 import，此时浏览器会直接发起一个请求，

如果不依赖服务端，就必须另起一个 service worker 进行拦截。

而 service worker 的注册必须要加载单独的 js 文件(静态服务)，无法将 sandbox 整套方案打包成一个 NPM 库来使用，更新迭代较为繁琐

- 通常的实现方法是  CommonJS 格式规范，以 require 模块的形式来模拟执行环境。

同样的类似的是 babal-loader 的处理 转换为 CJS格式的文件



#### 问题2 如何将ESM 转换为CJS模块

利用 @babel/plugin-transform-modules-commonjs 插件，将 ESM 语法转换成 CommonJS 格式规范
利用 @babel/plugin-transform-react-jsx Babel 插件，将 <div /> 转换成 React.createElement('div') 函数


#### 实现require函数

初级定义 对于script 标签引入的 UMD合适文件来说

因为 require 是要引入 react, react-dom 两个 NPM 依赖库的，所以实现 require 函数之前，先插入已打包为 UMD 规范的文件路径，以获取 React, ReactDom 全局变量。

`function require(moduleName) {
  return window[externals[moduleName]]
}`

-  externals 外部拓展
防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)
具有外部依赖(external dependency)的 bundle 可以在各种模块上下文(module context)中使用

`
const transpiledCode = Babel.transform(code, {
      plugins: [
        ['transform-modules-commonjs'],
        ['transform-react-jsx'],
      ]
    }).code
    // ③ 执行
    eval(transpiledCode)
`


### Sandbox 核心方法论
1. 加载依赖
2. 转译模块
3. 执行代码

#### 转译模块

babel 插件 + 文件类型判断

#### 模拟CJS 执行环境  
module.exports
require
require 获取依赖模块函数

module 存储模块执行结果

exports 导出模块执行结果

#### 代码路径
用者模块的代码绝对路径 + 引用相对路径 = 获取真正的代码绝对路径，比如：'./App.js' => '/src/App.js'

- 针对项目文件
- 获取真正的代码路径，比如：'./App.js' => '/src/App.js


#### JSON模块的转译
字符串格式 并添加 module.exports =  导出前缀 用于 require 引入

#### CSS代码模块

是 创建style标签，而后放置在 head内部 
stylesheet 样式表格
当前页面与href所指定文档的关系.即说明的是,href连接的文档是一个新式表
```

function createStyleNode(id, content) {
  var styleNode =
    document.getElementById(id) || document.createElement('style');
  styleNode.setAttribute('id', id);
  styleNode.type = 'text/css';
  if (styleNode.styleSheet) {
    styleNode.styleSheet.cssText = content;
  } else {
    styleNode.innerHTML = '';
    styleNode.appendChild(document.createTextNode(content));
  }
  document.head.appendChild(styleNode);
}
createStyleNode(
  ${JSON.stringify(id)},
  ${JSON.stringify(css)}
);
```
创建节点 写入 type  写入styleNode styleSheet.cssText = content; content document.head.appendChild(styleNode);

#### 实现目标
允许导入npm模块
允许引入源代码文件
热更新


#### 热更新
这部分还没有实现

目前采用的是全量编译


#### 获取npm依赖包
### 参考资料


- [搭建一个属于自己的在线 IDE](https://github.com/mcuking/blog/issues/86)
- [CodeSandbox 如何工作? 上篇](https://bobi.ink/2019/06/20/codesandbox/)
- [从 0 到 1 实现浏览器端沙盒运行环境](https://mp.weixin.qq.com/s/7CD_F0hEZtYRK0fvBWb_gQ)
- [网易云音乐低代码体系建设思考与实践](https://mp.weixin.qq.com/s/9yo-Au3wwsWErBJfFjhxUg)
- [跨项目区块复用方案实践](https://github.com/mcuking/blog/issues/88)