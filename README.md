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



#### codeSandBox 的实现

##### 第一个版本

codesandbox只是自己实现了一个算法，利用了类似require的加载方式，去一个个加载依赖到本地

也就是说这一版并不是实时根据代码中的依赖去npm仓库加载依赖，而是事先将依赖下载到本地，然后stub代码中的require，所以作者说这一版并不能支持所有的npm依赖。

而且这个版本应该是具体require a的时候才去分析a依赖了什么，然后一层层递归进去，这种递归如果项目依赖复杂，性能上也有很大的瓶颈。

##### webpack 版本

借鉴webpack DLLPlugin 插件的实现方式
DllPlugin做的事情就是把一个项目打包成一个dll依赖，将项目中的依赖关系包装在dll中，然后对外暴露接口。
webpack的DLLPlugin可以打包依赖项，并且使用一个manifest清单来标记打出的js包包含哪些依赖项。

> 而这个版本，借助webpack DllPlugin的思想，codesandbox是先分析依赖关系，然后为这个依赖关系创建一个hash值，去缓存中查看是否有相同的hash，如果有的话，直接返回打包好的Dll，如果没有，再根据依赖关系去npm源下载所有的依赖，暂存在tmp/:hash下面，下载完后，然后将所有的依赖打包成一个Dll，缓存并返回给使用者，然后清除刚刚创建的tmp/hash文件夹。


##### 浏览器端进行打包

服务端基于webpack DLLPLugin的打包构建会从依赖入口开始递归遍历所有依赖然后进行打包构建，而浏览器的打包构建只是 按需打包构建。所以会更快的原因有二，一是浏览器端打包构建就不需要服务端再做打包构建了，服务端只是纯粹的依赖项的递归获取，然后发送给浏览器端，这样就节省了服务端打包构建的时间，也节省了服务器开销；二是浏览器端的打包构建是按需构建而非全量构建。

我们可以实现对依赖项单独的安装及缓存

##### 加入浏览器缓存

作者说不采取从unpkg.com上直接动态请求文件的方案，是因为想支持离线方案，即即使你没有网络你也可以实现浏览器端的编译打包构建预览，前提是你已经在浏览器端做了相关文件的本地缓存。基于作者实现的服务端单个依赖打包的方案是将整个依赖模块的所有文件全部缓存在了本地浏览器，而基于动态的从unpkg.com上请求文件是单个的请求某个依赖模块里的单个文件，很容易出现某个依赖文件不存在的情况。

也就是说，每次去请求单独的依赖时，去后台获取依赖之前会先看一下本地是不是有缓存。



##### 最终版本


CodeSandbox 打包和运行并不依赖于服务器, 只是如果你所需的依赖在客户端没有缓存，需要去服务器请求

Editor: 编辑器。主要用于修改文件，CodeSandbox这里集成了 VsCode, 文件变动后会通知 Sandbox 进行转译。
Sandbox: 代码运行器。Sandbox 在一个单独的 iframe 中运行, 负责代码的转译(Transpiler)和运行(Evalation). 如最上面的图，左边是Editor，右边是Sandbox
Packager 包管理器。类似于yarn和npm，负责拉取和缓存 npm 依赖


##### 为什么不使用 webpack 在浏览器端运行

Webpack 移植到浏览器上, 可以利用 Webpack 强大的生态系统和转译机制(loader/plugin)，低成本兼容各种 CLI.


 Webpack 太重了😱，压缩过后的大小就得 3.5MB，这还算勉强可以接受吧；更大的问题是要在浏览器端模拟 Node 运行环境，这个成本太高了，得不偿失。
(stackBlitz 实现了)


生产模式. CodeSandbox 只考虑 development 模式，不需要考虑 production一些特性，比如
代码压缩，优化
Tree-shaking
性能优化
代码分割
文件输出. 不需要打包成chunk
服务器通信. Sandbox直接原地转译和运行, 而Webpack 需要和开发服务器建立一个长连接用于接收指令，例如 HMR.
静态文件处理(如图片). 这些图片需要上传到 CodeSandbox 的服务器
插件机制等等.



##### 项目构建过程

Sandbox 构建分为三个阶段:

Packager 包加载阶段，下载和处理所有npm模块依赖
Transpilation 转译阶段，转译所有变动的代码, 构建模块依赖图
Evaluation 执行阶段，使用 eval 运行模块代码进行预览


Packer
由于 CodeSandbox 已经包揽了代码构建的部分，所以我们并不需要devDependencies, 也就是说 在CodeSandbox 中我们只需要安装所有实际代码运行需要的依赖，这可以减少成百上千的依赖下载. 所以暂且不用担心浏览器会扛不住.

而在Packer下载依赖之前其实先经过了Transpilation转移阶段去按需分析依赖，然后再拿分析产物去Packer


Transpilation
这个阶段从应用的入口文件开始, 对源代码进行转译, 解析AST，找出下级依赖模块，然后递归转译，最终形成一个’依赖图’:

CodeSandbox 的整个转译器是在一个单独的 iframe 中运行的：

Editor 负责变更源代码，源代码变更会通过 postmessage 传递给 Compiler，这里面会携带 `Module+template`

大局上基本上可以划分为以下四个阶段:

- **配置阶段**：配置阶段会创建 Preset 对象，确定入口文件等等. CodeSandbox 目前只支持限定的几种应用模板，例如 vue-cli、create-react-app。不同模板之间目录结构的约定是不一样的，例如入口文件和 html 模板文件。另外文件处理的规则也不一样，比如 vue-cli 需要处理`.vue`文件。
- **依赖下载阶段**： 即 Packager 阶段，下载项目的所有依赖，生成 Manifest 对象
- **变动计算阶段**：根据 Editor 传递过来的源代码，计算新增、更新、移除的模块。
- **转译阶段**：真正开始转译了，首先重新转译上个阶段计算出来的需要更新的模块。接着从入口文件作为出发点，转译和构建新的依赖图。这里不会重复转译没有变化的模块以及其子模块




![Vite + Vue - 26 July 2022 (1)](https://user-images.githubusercontent.com/68687740/180930335-0f2d4544-9476-4caf-bd1d-d7f5aec8b92b.gif)

