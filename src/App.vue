<template>
  <div class="app-wrapper">
    <div class="editor-wrapper">
      <template v-for="item in Object.values(codeMap)">
        <div class="file-name">{{ item.path }}</div>
        <textarea
          class="code-editor"
          @change="noticeSandboxUpdate"
          v-model="codeMap[item.path].code"
        />
      </template>
    </div>
    <div class="sandbox-wrapper">
      <iframe
        id="sandbox"
        @load="noticeSandboxUpdate"
        src="sandbox.html"
        frameborder="0"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      codeMap: {
        '/src/index.jsx': {
          code: `
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
ReactDOM.render(
  <React.StrictMode>
    <div>Hello, Sandbox!</div>
    
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`.trim(),
          path: '/src/index.jsx',
        },
        '/src/App.jsx': {
          code: `
import React, { useState } from 'react'
import { title } from './data.json'
import './App.css'
export default function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello {title}!</p>
        <p>
          <button onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.jsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </p>
      </header>
    </div>
  )
}
`.trim(),
          path: '/src/App.jsx',
          style: {
            flex: 1,
          },
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
      },
    }
  },
  watch: {
    codeMap: {
      handler: function (val, oldVal) {
        this.noticeSandboxUpdate()
      },
      deep: true,
    },
  },
  methods: {
    noticeSandboxUpdate() {
      // console.log(111)
      document.querySelector('#sandbox').contentWindow.postMessage({
        codeMap: JSON.parse(JSON.stringify(this.codeMap)),
        entry: '/src/index.jsx',
        dependencies: {},
        externals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      })
    },
  },
}
</script>

<style scoped>
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
</style>
