<script setup>
import { reactive, ref } from '@vue/reactivity'
import reactApp from './components/reactApp.vue'
const statusModule = ref('react')
// react or vue
// let packageJSON = {

// }
const reactCodeInit = reactive({
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
    id: 1,
    readOnly: false,
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
    id: 2,
    readOnly: false,
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
    id: 3,
    readOnly: false,
  },
  '/src/data.json': {
    code: `{"title": "bitSandBox"}`,
    path: '/src/data.json',
    id: 4,
    readOnly: false,
  },
  './package.json': {
    code: `{
  dependencies: {
    "babel": '^7.13.12',
    "react": '^1.26.5',
    "react-dom": '^16.14.0',
    "path-browser": '^2.2.1',
  },
}`,
    path: './package.json',
    id: 5,
    readOnly: true,
  },
})

// const vueCodeInit = reactive({})
</script>

<template>
  <reactApp :codeInit="reactCodeInit"></reactApp>
</template>
