### bitSandBox 

live demo: https://f-one-1.github.io/bitSandBox/

> demo项目，用于学习实践

#### 已实现模块

- [x] 在线编辑组件 ([highlight-code](https://github.com/F-one-1/vue-highlight-code))
- [x] 加载依赖
  - 允许动态加载 cdn 依赖，通过添加script标签的方式
- [x] 转译模块 
  - (css,json,jsx) 分别进行编译处理
  - 构建模块依赖关系图，以便 require 源代码模块引入
- [x] 执行代码
  - 构造CommonJS 环境，必备三套件，实现自定义模块 require ，module，exports
  - 找到入口文件执行





#### 未实现模块

- [x] 动态加载依赖
  - 预期实现思路：动态导入script标签，通过cdn引入依赖      
  - 可能存在的问题：(  (⊙﹏⊙)，问题蛮多的)
    - 离线模式
    - 性能问题
  - 潜在的最优解决方案
    - stackblitz    (闪电栈，德三狂喜)
    - 一个WASM 编写的的**WebContainers**，允许您创建全栈 Node.js 环境。
    - 加载了 VS Code 强大的编辑体验、完整的终端、npm 等。它也*完全在您的浏览器*中运行，
    - **比您的本地环境更快**。构建完成速度比 yarn/npm 快 20%，包安装完成速度 >= 5 倍。
    - **Node.js 在浏览器中调试**。与 Chrome DevTools 的无缝集成支持本地后端调试，无需安装或扩展。
    - **默认安全**。所有代码执行都发生*在*浏览器的安全沙箱内，而不是远程虚拟机或本地二进制文件上。
    - WebContainers 包括一个映射到浏览器的 ServiceWorker API 的虚拟化 TCP 网络堆栈，使您能够按需即时创建实时 Node.js 服务器，即使您离线也能继续工作。
    - stackblitz 作者未来的展望
      - 无需在硬盘上安装节点、npm、git、VS Code 或其他任何东西。您只需要一个网络浏览器
- [ ] 模块热更新
  - 预期实现思路：
  - 引入 react-refresh-runtime, react-refresh-babel 
  - 收集代码已改变的模块列表，并重新执行该代码模块，即可达到热更新的效果。
  - 模块互相引用的热更新




![Vite + Vue - 26 July 2022 (1)](https://user-images.githubusercontent.com/68687740/180930335-0f2d4544-9476-4caf-bd1d-d7f5aec8b92b.gif)

