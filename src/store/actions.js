import {
  debug,
  apiCall,
  clearStorage,
  saveToStorage,
  API_ROUTES
} from '../assets/functions.js'

import {
  getUnknownMessage,
  getTranslation
} from '../assets/translations.js'

const addNotification = function ({commit}, notif) {
  notif.message = getTranslation('fr', notif.message)
  commit('ADD_NOTIFICATION', notif)
  saveToStorage('notifications', this.state.notifications)
}

const resetData = function ({commit}) {
  commit('RESET_ALL_DATA')
  clearStorage()
}

const closeNotification = function ({commit}, id) {
  commit('CLOSE_NOTIFICATION', id)
  saveToStorage('notifications', this.state.notifications)
}

const closeAllNotifications = function ({commit}) {
  commit('CLOSE_ALL_NOTIFICATIONS')
  saveToStorage('notifications', this.state.notifications)
}

const setUserData = function ({commit}, data) {
  commit('SET_USER_DATA', data)
  saveToStorage('userData', this.state.userData)
}

// data = [ { property, content }  ]
const updateUserData = function ({ commit }, data) {
  return new Promise((resolve, reject) => {
    const httpArgs = {}
    data.forEach(x => { httpArgs[x.property] = x.content })
    const api = API_ROUTES.updateProfile
    apiCall(api.path, api.method, httpArgs)
      .then(res => {
        debug(res)
        if (res.success) {
          commit('UPDATE_USER_DATA', data)
          saveToStorage('userData', this.state.userData)
        }
        commit('ADD_NOTIFICATION', { type: res.success ? 'success' : 'error', message: res.message })
        saveToStorage('notifications', this.state.notifications)
        resolve(res.success)
      })
      .catch(err => {
        debug(err)
        commit('ADD_NOTIFICATION', { type: 'error', message: getUnknownMessage('fr') })
        reject(err)
      })
  })
}

// data = [ { property, content }  ]
const updateUserPassword = function ({ commit }, data) {
  return new Promise((resolve, reject) => {
    const httpArgs = {}
    data.forEach(x => { httpArgs[x.property] = x.content })
    const api = API_ROUTES.updatePassword
    apiCall(api.path, api.method, httpArgs)
      .then(res => {
        debug(res)
        commit('ADD_NOTIFICATION', { type: res.success ? 'success' : 'error', message: res.message })
        saveToStorage('notifications', this.state.notifications)
        resolve(res.success)
      })
      .catch(err => {
        debug(err)
        commit('ADD_NOTIFICATION', { type: 'error', message: getUnknownMessage('fr') })
        reject(err)
      })
  })
}

const disconnectUser = function ({commit}) {
  const api = API_ROUTES.logout
  apiCall(api.path, api.method)
    .then(res => {
      debug(res)
      commit('RESET_ALL_DATA')
      commit('ADD_NOTIFICATION', { type: res.success ? 'success' : 'warning', message: res.message })
    })
    .catch(err => {
      debug(err)
      commit('RESET_ALL_DATA')
    })
}

export default {
  addNotification,
  resetData,
  closeNotification,
  closeAllNotifications,
  setUserData,
  updateUserData,
  updateUserPassword,
  disconnectUser
}
