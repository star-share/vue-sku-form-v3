# vue-sku-form

基于 Vue3 & Element Plus 的电商 SKU 表单配置组件

这是[vue-sku-form](https://github.com/hooray/vue-sku-form)的Vue3版本，完全兼容原有的功能和API。

## 特点

- 基于Vue3和Element Plus
- 完全兼容原vue-sku-form的API
- 支持使用v-model:attribute和v-model:sku双向绑定
- 支持主题切换
- 支持自定义表格结构

## 安装

```bash
npm install vue-sku-form
```

## 使用

### 全局注册

```js
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import SkuForm from 'vue-sku-form'

const app = createApp(App)
app.use(ElementPlus)
app.use(SkuForm)
app.mount('#app')
```

### 局部注册

```vue
<template>
  <SkuForm
    :source-attribute="sourceAttribute"
    v-model:attribute="attribute"
    v-model:sku="sku"
  />
</template>

<script setup>
import { ref } from 'vue'
import SkuForm from 'vue-sku-form'

const sourceAttribute = ref([
  {
    name: '颜色',
    item: ['黑', '金', '白']
  },
  {
    name: '内存',
    item: ['16G', '32G']
  }
])
const attribute = ref([])
const sku = ref([])
</script>
```

## 开发

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 你或许感兴趣

[Fantastic-admin](https://hooray.gitee.io/fantastic-admin/)

一款开箱即用的 Vue 中后台管理系统框架

<table>
    <tr>
        <td><img src="https://hooray.gitee.io/fantastic-admin/preview1.png" /></td>
        <td><img src="https://hooray.gitee.io/fantastic-admin/preview2.png" /></td>
    </tr>
    <tr>
        <td><img src="https://hooray.gitee.io/fantastic-admin/preview3.png" /></td>
        <td><img src="https://hooray.gitee.io/fantastic-admin/preview4.png" /></td>
    </tr>
</table>
