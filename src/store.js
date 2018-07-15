import Vue from 'vue'
import Vuex from 'vuex'

const storeDebugMode = true
const debug = (...el) => storeDebugMode ? console.log(...el) : null

const notificationTypes = [
  {type: 'info', header: 'Information'},
  {type: 'warning', header: 'Attention'},
  {type: 'success', header: 'Succès'},
  {type: 'error', header: 'Erreur'}
]
const httpCodesList = {
  200: true,
  404: false
}
const isHttpCodeGood = httpCode => (httpCodesList.hasOwnProperty(httpCode) && httpCodesList[httpCode])

const API_PREFIX = 'http://localhost:3000/api'
const API_ROUTES = {
  login: { path: '/login', method: 'POST' }
}
const apiCall = (_, apiCallUrl, fetchMethod, fetchArgsObj, fetchHeadersObj) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: fetchMethod || 'GET',
      body: fetchArgsObj ? JSON.stringify(fetchArgsObj) : {},
      headers: fetchHeadersObj || {}
    }
    fetch(API_PREFIX + apiCallUrl, options)
      .then(res => isHttpCodeGood(res.status) ? resolve(res) : reject(res)) // Request sent successfully, check if it worked
      .catch(err => {
        debug('blablabla', err)
        reject(err)
      })
  })
}

const assignIndexToId = arrayOfObj => arrayOfObj.forEach((x, index) => { x.id = index })

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notification: [],
    apiCall,
    userData: {
      username: ''
    }
  },
  getters: {
    API_ROUTES: () => API_ROUTES,
    notification: state => state.notification,
    notificationCount: state => state.notification.length
  },
  mutations: {
    REORDER_NOTIFICATION (state) {
      // assignIndexToId(state.notification)
    },
    ADD_NOTIFICATION (state, notif) {
      let header = ''
      // Check if type exists and get its corresponding header text
      if (notif.type && notif.message && ({header} = notificationTypes.find(x => x.type === notif.type))) {
        debug(`Mutation : ADD_NOTIFICATION=type:${notif.type}, message:${notif.message}`)
        state.notification.push({
          id: state.notification.length === 0 ? 0 : state.notification[state.notification.length - 1].id + 1,
          type: notif.type,
          header,
          message: notif.message
        })
      }
    },
    CLOSE_NOTIFICATION (state, id) {
      let index = -1
      if ((index = state.notification.findIndex(x => x.id === id))) {
        debug(`Mutation : CLOSE_NOTIFICATION=id:${id}, index:${index}`)
        state.notification.splice(index, 1)
      }
    },
    SET_USER_DATA (state, data) {
      debug('Mutation : SET_USER_DATA=' + data)
    }
  },
  actions: {
    reorderNotification: ({commit}) => commit('REORDER_NOTIFICATION'),
    addNotification: ({commit}, notif) => commit('ADD_NOTIFICATION', notif),
    closeNotification: ({commit}, index) => commit('CLOSE_NOTIFICATION', index),
    setUserData: ({commit}, data) => commit('SET_USER_DATA', data)
  },
  strict: true
})
