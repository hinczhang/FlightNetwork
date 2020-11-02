import Vue from 'vue'
import App from './App.vue'
import AMap from 'vue-amap'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(AMap);
// 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德key
  key: '072745894c81bf5b9a1eae84dfdb61c9',
  // 插件集合 （插件按需引入）
  plugin: ['AMap.Geolocation']
});
new Vue({
  render: h => h(App),
}).$mount('#app')
