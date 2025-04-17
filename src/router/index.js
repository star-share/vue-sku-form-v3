import { createRouter, createWebHashHistory } from 'vue-router'
import example from './example'

const router = createRouter({
  history: createWebHashHistory(),
  routes: example
})

export default router
