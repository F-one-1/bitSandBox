<script setup>
import { reactive, ref } from '@vue/reactivity'
import { HighCode } from 'vue-highlight-code'
import 'vue-highlight-code/dist/style.css'
import { watch } from '@vue/runtime-core'
import dynamicLoadJs from './utils/dynamicLoad'
// import { isDark } from '~/composables/dark'
// 等待拆分组件 ，写成面条了
import { ElMessage } from 'element-plus'
const loadState = ref('')

const funcDynamicLoad = (url) => {
  const bool = dynamicLoadJs(url)
  loadState.val = bool
}
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
  "dependencies": {
    "babel": "^7.13.12",
    "react": "^1.26.5",
    "react-dom": "^16.14.0",
    "path-browser": "^2.2.1",
  },
}`,
    path: './package.json',
    id: 5,
    readOnly: true,
  },
})

let codeMapLen = Object.keys(codeMap).length

// console.log(codeMap['/src/App.css'].code, 'codeMap')
const createNewFile = (path = '/src/demo.jsx') => {
  // console.log('createNewFile')
  codeMap[path] = {}
  codeMap[path].path = path
  codeMap[path].code = ''
}
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

const H = ref(null)
// 弹窗组件
const dialogVisible = ref(false)
const dialogTableVisible = ref(true)
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const formLoad = reactive({
  name: '',
  url: '',
  version: '',
})

const dialogVisibleFunc = () => {
  dialogVisible.value = !dialogVisible.value
  // console.log(dialogVisible.value)
}

const dialogDynamic = ref(false)
const dialogDynamicFunc = () => {
  dialogDynamic.value = !dialogDynamic.value
  // console.log(dialogVisible.value)
}
const getCodeValue = (e, p) => {
  // console.log(e, p, 'vp')
  codeMap[p].code = e
  noticeSandboxUpdate()
}
const activeNames = ref([1])
const handleChange = (val) => {
  // console.log(val)
}
const fontSize = '12px'
const height = '400px'
const width = '580px'
const bool = true
const boolFalse = false
const dialogWidht = '600px'
const readOnly = 'true'
const dialogVisibleFinishFunc = () => {
  // console.log()
  createNewFile(form.name)
  form.name = ''
  dialogVisible.value = false
}

const successMessage = () => {
  ElMessage({
    showClose: true,
    message: '成功导入相关依赖',
    type: 'success',
  })
}

const errorMessage = () => {
  ElMessage({
    showClose: true,
    message: '依赖导入失败',
    type: 'error',
  })
}
const dialogDynamicFinishFunc = () => {
  const solution = dynamicLoadJs(formLoad.url)
  if (solution) {
    successMessage()
  } else {
    errorMessage()
  }
}
</script>
<template>
  <div class="app">
    <div class="app_editor">
      <div class="app_editor_button">
        <el-button color="#457B9D" plain @click="dialogVisibleFunc"
          >new file</el-button
        >
        <el-button color="#457B9D" plain @click="dialogDynamicFunc"
          >add dependency</el-button
        >
      </div>

      <el-collapse v-model="activeNames" @change="handleChange">
        <template v-for="item in Object.values(codeMap)">
          <el-collapse-item :title="item.path" :name="item.id">
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
              :readOnly="codeMap[item.path].readOnly"
            >
            </HighCode>
          </el-collapse-item>
          <!-- <div class="app_editor_item">
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
        </div> -->
        </template>
      </el-collapse>
    </div>

    <div class="app_frame">
      <iframe
        id="sandbox"
        @load="noticeSandboxUpdate"
        src="sandbox.html"
        frameborder="0"
      ></iframe>
    </div>
    <el-dialog
      :append-to-body="true"
      v-model="dialogVisible"
      title="file"
      :lock-scroll="boolFalse"
      :width="dialogWidht"
    >
      <el-form :model="form">
        <el-form-item label="File Path" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="File Type" :label-width="formLabelWidth">
          <el-select
            v-model="form.region"
            placeholder="Please select File Type"
          >
            <el-option label="jsx" value="jsx" />
            <el-option label="js" value="js" />
            <el-option label="css" value="css" />
            <el-option label="json" value="json" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisibleFinishFunc"
            >create</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      v-model="dialogDynamic"
      title="dependency"
      :lock-scroll="boolFalse"
      :width="dialogWidht"
    >
      <el-form :model="form">
        <el-form-item label="引入依赖的cdn地址" :label-width="formLabelWidth">
          <el-input
            v-model="formLoad.url"
            autocomplete="off"
            placeholder="https://unpkg.com/react@16.14.0/umd/react.development.js"
          />
        </el-form-item>
        <el-form-item label="依赖包的名称" :label-width="formLabelWidth">
          <el-input
            v-model="formLoad.name"
            autocomplete="off"
            placeholder="react"
          />
        </el-form-item>
        <el-form-item label="依赖包的版本" :label-width="formLabelWidth">
          <el-input
            v-model="formLoad.version"
            autocomplete="off"
            placeholder="@16.14.0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogDynamicFinishFunc"
            >create</el-button
          >
        </span>
      </template>
    </el-dialog>
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
    width: 600px;
    display: flex;
    flex-flow: wrap;
    flex-direction: column;
    &_create {
      position: relative;
      width: 70px;
      height: 30px;
      font-size: 12px;
      background-color: aquamarine;
      border: 1px solid black;
    }
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
