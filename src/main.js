// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts';
import CKEditor from '@ckeditor/ckeditor5-vue';

import './mock/mock'
// require('./common/dark')
// require('./common/westeros')
import 'echarts/extension/bmap/bmap';
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(CKEditor);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});
// router.beforeEach((to, from, next) => {
//   console.log(to);
//   console.log(from);
//   if(!localStorage.getItem('token')){
//     this.$router.push({name:'login'});
//   }
// });