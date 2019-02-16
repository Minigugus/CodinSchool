import Vue from 'vue'
import Router from 'vue-router'
import NonConnecte from './NonConnecte'
import NiveauExercice from './NiveauExercice'
import Administration from './Administration'

Vue.use(Router)

export default new Router({
  routes: [].concat(NonConnecte, NiveauExercice, Administration)
})
