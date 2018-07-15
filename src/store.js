import Vue from 'vue'
import Vuex from 'vuex'

const fn = require('./functions.js')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiCall: fn.apiCall,
    notifications: fn.loadFromStorage('notifications') || [],
    userData: {
      username: ''
    }
  },
  getters: {
    API_ROUTES: () => fn.API_ROUTES,
    notification: state => state.notifications,
    notificationCount: state => state.notifications.length
  },
  mutations: {
    ADD_NOTIFICATION (state, notif) {
      let header = ''
      // Check if type exists and get its corresponding header text
      if (notif.type && notif.message && ({header} = fn.notificationTypes.find(x => x.type === notif.type))) {
        fn.debug(`Mutation : ADD_NOTIFICATION=type:${notif.type}, message:${notif.message}`)
        state.notifications.push({
          id: state.notifications.length === 0 ? 0 : state.notifications[state.notifications.length - 1].id + 1,
          type: notif.type,
          header,
          message: notif.message
        })
        fn.saveToStorage('notifications', state.notifications)
      }
    },
    CLOSE_NOTIFICATION (state, id) {
      let index = -1
      if ((index = state.notifications.findIndex(x => x.id === id)) >= 0) {
        fn.debug(`Mutation : CLOSE_NOTIFICATION=id:${id}, index:${index}`)
        state.notifications.splice(index, 1)
        fn.saveToStorage('notifications', state.notifications)
      }
    },
    CLOSE_ALL_NOTIFICATIONS (state) {
      fn.debug(`Mutation : CLOSE_ALL_NOTIFICATIONS`)
      state.notifications = []
      fn.saveToStorage('notifications', state.notifications)
    },
    SET_USER_DATA (state, data) {
      fn.debug('Mutation : SET_USER_DATA=' + data)
    }
  },
  actions: {
    addNotification: ({commit}, notif) => commit('ADD_NOTIFICATION', notif),
    closeNotification: ({commit}, id) => commit('CLOSE_NOTIFICATION', id),
    closeAllNotifications: ({commit}) => commit('CLOSE_ALL_NOTIFICATIONS'),
    setUserData: ({commit}, data) => commit('SET_USER_DATA', data)
  },
  strict: true
})
