import Vue from 'vue'
import Vuex from 'vuex'

import {
  clearStorage,
  saveToStorage,
  loadFromStorage,
  notificationTypes,
  debug,
  isEmailValid
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
  mutations: {
    RESET_DATA (state) {
      state.notifications = []
      state.userData = {}
      clearStorage()
    },
    ADD_NOTIFICATION (state, notif) {
      let notifTypeData = ''
      // Check if type exists and get its corresponding header text
      if (notif.type && notif.message && (notifTypeData = notificationTypes.find(x => x.type === notif.type))) {
        debug(`Mutation : ADD_NOTIFICATION=type:${notif.type}, message:${notif.message}`)
        state.notifications.push({
          id: state.notifications.length === 0 ? 0 : state.notifications[state.notifications.length - 1].id + 1,
          type: notif.type,
          icon: notifTypeData.icon,
          header: notifTypeData.header,
          message: notif.message
        })
        saveToStorage('notifications', state.notifications)
      }
    },
    CLOSE_NOTIFICATION (state, id) {
      let index = -1
      if ((index = state.notifications.findIndex(x => x.id === id)) >= 0) {
        debug(`Mutation : CLOSE_NOTIFICATION=id:${id}, index:${index}`)
        state.notifications.splice(index, 1)
        saveToStorage('notifications', state.notifications)
      }
    },
    CLOSE_ALL_NOTIFICATIONS (state) {
      debug(`Mutation : CLOSE_ALL_NOTIFICATIONS`)
      state.notifications = []
      saveToStorage('notifications', state.notifications)
    },
    SET_USER_DATA (state, data) {
      debug(`Mutation : SET_USER_DATA=`, data)
      state.userData = data
      saveToStorage('userData', state.userData)
    },
    UPDATE_USER_DATA (state, data) {
      debug(`Mutation : UPDATE_USER_DATA=`, data)
      if (data.property === 'email' && !isEmailValid(data.content)) return
      state.userData[data.property] = data.content
      saveToStorage('userData', state.userData)
    }
  },
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
