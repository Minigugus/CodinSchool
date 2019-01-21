import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { createProvider } from './vue-apollo'
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui-css/semantic.min.css'

Vue.config.productionTip = false
Vue.use(SuiVue)

new Vue({
  router,
  apolloProvider: createProvider({}, { router }),
  render: h => h(App)
}).$mount('#app')
