import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const router = new VueRouter()
router.map({
  '/': {
    component: App
  }
})
router.start(App, '#app')
