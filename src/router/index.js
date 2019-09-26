import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'map',
      component: resolve => require(['@/views/viewsMap.vue'], resolve)
    }
  ]
})
