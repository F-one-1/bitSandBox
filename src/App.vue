<script setup>
import { reactive, ref } from '@vue/reactivity'
import { HighCode } from 'vue-highlight-code'
import 'vue-highlight-code/dist/style.css'
import { watch } from '@vue/runtime-core'
const codeMap = reactive({
  '/src/index.jsx': {
    code: `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
ReactDOM.render(
  <React.StrictMode>
    <div className="App">
      <header className="App-header">
        <App />
      </header>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);`.trim(),
    path: '/src/index.jsx',
    type: 'javascript',
  },
  '/src/App.css': {
    code: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  min-height: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

`.trim(),
    path: `/src/App.css`,
    type: 'css',
  },
  '/src/App.jsx': {
    code: `
import React, { useState } from 'react'
import './App.css'
import { title } from './data.json'
export default function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
    <p>Hello {title}!!!</p>
        <p>
          Edit and will auto reload.
        </p>
        <a
          className="App-link"
          href="https://github.com/F-one-1/bitSandBox"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go Github 
        </a>
      
        <p>
          <button onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
    </div>
  )
}
`.trim(),
    path: '/src/App.jsx',
    style: {
      flex: 1,
    },
  },
  '/src/data.json': {
    code: `{"title": "bitSandBox"}`,
    path: '/src/data.json',
  },
})
// const height = '200px'
const noticeSandboxUpdate = () => {
  // console.log(111)
  document.querySelector('#sandbox')?.contentWindow.postMessage({
    codeMap: JSON.parse(JSON.stringify(codeMap)),
    entry: '/src/index.jsx',
    dependencies: {},
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  })
}
// watch(
//   () => codeMap.value,
//   (value, oldValue) => {
//     noticeSandboxUpdate()
//   },
//   { deep: true, immediate: true }
// )
const H = ref(null)
const getCodeValue = (e, p) => {
  console.log(e, p, 'vp')
  codeMap[p].code = e
  noticeSandboxUpdate()
}
const fontSize = '12px'
const height = '500px'
const width = '480px'
</script>
<template>
  <div class="app">
    <div class="app_editor">
      <template v-for="item in Object.values(codeMap)">
        <div class="app_editor_item">
          <div class="file-name">{{ item.path }}</div>
          <HighCode
            ref="H"
            :codeValue="codeMap[item.path].code"
            @getCodeValue="getCodeValue($event, item.path)"
            :textEditor="true"
            :nameShow="false"
            :copy="false"
            :fontSize="fontSize"
            :height="height"
            :width="width"
            :lang="codeMap[item.path].type"
          >
          </HighCode>
        </div>
        <!-- <textarea
          class="code-editor"
          @change="noticeSandboxUpdate"
          v-model="codeMap[item.path].code"
        /> -->
      </template>
    </div>

    <div class="app_frame">
      <iframe
        id="sandbox"
        @load="noticeSandboxUpdate"
        src="sandbox.html"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
body {
  padding: 0;
  margin: 0;
}

.app {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  &_editor {
    width: 1000px;
    display: flex;
    flex-flow: wrap;

    &_item {
      display: flex;
      flex-direction: column;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
  &_frame {
    flex: 1;
    height: 1000px;
    // width: 500px;
  }
}
.file-name {
  position: relative;
  height: 20px;
}
#sandbox {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
