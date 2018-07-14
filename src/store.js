import Vue from 'vue'
import Vuex from 'vuex'

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
        console.log('blablabla', err)
        reject(err)
      })
  })
}

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
    ADD_NOTIFICATION (state, notif) {
      let header = ''
      // Check if type exists and gfet its corresponding header text
      if (notif.type && notif.message && ({header} = notificationTypes.find(x => x.type === notif.type))) {
        console.log(`Mutation : ADD_NOTIFICATION= ${notif.type} : ${notif.message}`)
        state.notification.push({
          type: notif.type,
          header,
          message: notif.message
        })
      }
    },
    CLOSE_NOTIFICATION (state, index) {
      if (state.notification.hasOwnProperty(index)) {
        console.log('Mutation : CLOSE_NOTIFICATION=' + index)
        state.notification.splice(index, 1)
      }
    },
    SET_USER_DATA (state, data) {
      console.log('Mutation : SET_USER_DATA=' + data)
    }
  },
  actions: {
    addNotification: ({commit}, notif) => commit('ADD_NOTIFICATION', notif),
    closeNotification: ({commit}, index) => commit('CLOSE_NOTIFICATION', index),
    setUserData: ({commit}, data) => commit('SET_USER_DATA', data)
  },
  strict: true
})
