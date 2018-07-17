import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'

import {
  loadFromStorage
} from './functions.js'

const stripHtml = str => str.replace(/[\u00A0-\u9999<>&]/gim, i => '&#' + i.charCodeAt(0) + ';')
const stripObjHtml = obj => {
  const temp = {}
  for (let x in obj) {
    if (typeof obj[x] === 'string') temp[x] = stripHtml(obj[x])
    else temp[x] = obj[x]
  }
  return temp
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notifications: loadFromStorage('notifications') || [],
    userData: loadFromStorage('userData') || {}
  },
  getters: {
    getNotifications: state => state.notifications,
    getNotificationsCount: state => state.notifications.length,
    getUserData: state => stripObjHtml(state.userData)
  },
  mutations,
  actions: {
    resetData: ({commit}) => commit('RESET_DATA'),
    addNotification: ({commit}, notif) => commit('ADD_NOTIFICATION', notif),
    closeNotification: ({commit}, id) => commit('CLOSE_NOTIFICATION', id),
    closeAllNotifications: ({commit}) => commit('CLOSE_ALL_NOTIFICATIONS'),
    setUserData: ({ commit }, data) => commit('SET_USER_DATA', data),
    updateUserData: ({commit}, data) => commit('UPDATE_USER_DATA', data)
  },
  strict: true
})
