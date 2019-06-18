import Vue from 'vue'
import App from './App.vue'
import clipboard from 'clipboard'
import router from './router'
import store from './store'
import 'lib-flexible/flexible.js'
Vue.config.productionTip = false
Vue.prototype.clipboard = clipboard
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('LZtoken')
    if (token == null) {
        if(to.path == '/'){ // 如果是登录页面路径，就直接next()
            next()
        } else { // 不然就跳转到登录
            next('/')
        }
    } else {
        next()
    }
    // eslint-disable-next-line no-console
    // console.log(to.path)
})
// eslint-disable-next-line no-undef

Vue.filter('toFixedSix',function(value){
    value = Number(value)
    return value.toFixed(6)
})
Vue.filter('toFixedFour',function(value){
    value = Number(value)
    return value.toFixed(4)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
