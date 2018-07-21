import {
  debug,
  apiCall,
  clearStorage,
  saveToStorage,
  API_ROUTES,
  isHttpCodeGood,
  getHttpMessage
} from './functions.js'

const addNotification = function ({commit}, notif) {
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

const updateUserData = function ({commit}, data) {
  commit('UPDATE_USER_DATA', data)
  saveToStorage('userData', this.state.userData)
  commit('ADD_NOTIFICATION', { type: 'success', message: 'Les données ont bien été mises à jour.' })
  saveToStorage('notifications', this.state.notifications)
}

const disconnectUser = function ({commit}) {
  const httpCodesList = {
    200: { ok: true, message: 'Vous avez été déconnecté.' },
    401: { ok: false, message: `Vous n'êtes pas connecté.` }
  }
  const api = API_ROUTES.logout
  apiCall(api.path, api.method)
    .then(res => {
      commit('RESET_ALL_DATA')
      const type = isHttpCodeGood(httpCodesList, res.status) ? 'success' : 'warning'
      commit('ADD_NOTIFICATION', { type, message: getHttpMessage(httpCodesList, res.status) })
      return res.json()
    })
    .then(debug)
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
  disconnectUser
}
