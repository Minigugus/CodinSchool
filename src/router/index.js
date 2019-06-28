import Vue from 'vue'
import Router from 'vue-router'
import NonConnecte from './NonConnecte'
import Connecte from './Connecte'

Vue.use(Router)

export default new Router({
  routes: [...NonConnecte, ...Connecte]
})
