import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { createProvider } from './vue-apollo'

// Semantic UI Vue : https://github.com/Semantic-UI-Vue/Semantic-UI-Vue
import SuiVue from 'semantic-ui-vue'
Vue.use(SuiVue)

// Style du Framework Semantic UI
import 'semantic-ui-css/semantic.min.css'

// Margin/padding de Bootsrap
import './bootstrap-margin-padding.no-responsive.min.css'

Vue.config.productionTip = false

new Vue({
  router,
  apolloProvider: createProvider({}, { router }),
  render: h => h(App)
}).$mount('#app')
