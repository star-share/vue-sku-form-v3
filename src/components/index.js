import SkuForm from './SkuForm.vue'

// 版本信息
const version = '1.0.0'

// 组件安装函数
const install = (app) => {
  app.component('SkuForm', SkuForm)
}

// 组件库对象
const SkuFormLib = {
  version,
  install,
  SkuForm
}

// Vue插件安装函数
SkuForm.install = app => {
  app.component('SkuForm', SkuForm)
}

// 导出方式支持 ES Module、CommonJS 和全局变量
export { version, SkuForm }
export default SkuFormLib
