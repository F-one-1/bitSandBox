<script setup>
import { reactive, ref } from '@vue/reactivity'
import { HighCode } from 'vue-highlight-code'
import 'vue-highlight-code/dist/style.css'
import { watch } from '@vue/runtime-core'
const codeMap = reactive({
  '/src/index.jsx': {
    code: `import React from 'react';
import ReactDOM from 'react-dom';
ReactDOM.render(
  <React.StrictMode>
    <div className="App">
      <header className="App-header">
        <p>Hello bitSandBox !!!</p>
        <p>
          Edit <code>src/index.jsx</code> or <code>src/App.css</code> and will auto reload.
        </p>
        <a
          className="App-link"
          href="https://github.com/F-one-1/bitSandBox"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go Github 
        </a>
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

.App-logo {
  height: 500px;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
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

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

`.trim(),
    path: `/src/App.css`,
    type: 'css',
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
const funcLang = ''
</script>
<template>
  <div class="app">
    <div class="app_editor">
      <template v-for="item in Object.values(codeMap)">
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
          :lang="codeMap[item.path].type"
        >
        </HighCode>
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
    // width: 600px;
  }
  &_frame {
    flex: 1;
    height: 1000px;
    width: 500px;
  }
}
#sandbox {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
