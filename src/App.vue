<script setup>
import { reactive } from '@vue/reactivity'
import { HighCode } from 'vue-highlight-code'
import 'vue-highlight-code/dist/style.css'
import { watch } from '@vue/runtime-core'
const codeMap = reactive({
  '/src/App.jsx': {
    code: `

        import React, { useState } from 'react'
        export default function App() {
          return (
            <div className="App">
              <header className="App-header">
              </header>
            </div>
          )
        }
        `.trim(),
    path: '/src/App.jsx',
  },
  '/src/index.jsx': {
    code: `
import React from 'react';
import ReactDOM from 'react-dom';
ReactDOM.render(
  <React.StrictMode>
    <div>1111</div>
  </React.StrictMode>,
  document.getElementById('root')
);`.trim(),
    path: '/src/index.jsx',
  },
  // '/src/data.json': {
  //   code: `{ "title": "Mini Sandbox - Json Data" }`,
  //   path: '/src/data.json',
  // },
  '/src/App.css': {
    code: `
body {
  padding: 0;
  margin: 0;
}
.App {
  text-align: center;
}
.App-header {
  background-color: #282c34;
  min-height: 100vh;
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
button {
  font-size: calc(10px + 2vmin);
}
`.trim(),
    path: `/src/App.css`,
  },
})

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
watch(
  () => codeMap,
  (value, oldValue) => {
    noticeSandboxUpdate()
  },
  { deep: true, immediate: true }
)
</script>
<template>
  <div class="app">
    <div class="app-editor">
      <template v-for="item in Object.values(codeMap)">
        <div class="file-name">{{ item.path }}</div>
        <!-- <HighCode @getCodeValue="getCodeValue(item.path)"> </HighCode> -->
        <textarea
          class="code-editor"
          @change="noticeSandboxUpdate"
          v-model="codeMap[item.path].code"
        />
      </template>
    </div>
    <div class="app-frame">
      <iframe
        id="sandbox"
        @load="noticeSandboxUpdate"
        src="sandbox.html"
        frameborder="0"
      />
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
  &.editor {
  }
}
</style>
