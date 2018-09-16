import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import mutations from './mutations.js'

import {
  // debug,
  loadFromStorage,
  // stripHtml,
  stripObjHtml
} from '../assets/functions.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // [ { id, type, icon, header, message } ]
    notifications: loadFromStorage('notifications') || [],
    // { firstname, lastname, email, avatar, roles[str] }
    userData: loadFromStorage('userData') || {}
  },
  getters: {
    getNotifications: state => state.notifications,
    getNotificationsCount: state => state.notifications.length,
    getUserData: state => stripObjHtml(state.userData),
    isUserLoggedIn: state => Object.keys(state.userData).length > 0
  },
  actions,
  mutations,
  strict: true
})
