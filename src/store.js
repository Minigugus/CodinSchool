import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import mutations from './mutations.js'

import {
  loadFromStorage,
  // stripHtml,
  stripObjHtml
} from './functions.js'

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
    getUserData: state => stripObjHtml(state.userData)
  },
  actions,
  mutations,
  strict: true
})
