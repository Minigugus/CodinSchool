import Vue from 'vue'
import Router from 'vue-router'
import NonConnecte from './NonConnecte'
import Utilisateur from './Utilisateur'
import NiveauExercice from './NiveauExercice'
import Administration from './Administration'

Vue.use(Router)

export default new Router({
  routes: [].concat(NonConnecte, Utilisateur, NiveauExercice, Administration)
})
