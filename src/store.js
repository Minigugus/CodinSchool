import Vue from 'vue'
import Vuex from 'vuex'

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
    notification: {
      visible: true,
      type: 'info',
      header: 'Irure officia ex officia cillum sit duis voluptate sint est deserunt.',
      message: 'Velit id nulla aliquip non. Lorem fugiat eiusmod commodo sunt deserunt ad ea velit reprehenderit Lorem ipsum pariatur enim magna. Ut nulla magna est do adipisicing cillum dolor nostrud sunt adipisici'
    },
    apiCall,
    userData: {
      username: ''
    }
  },
  getters: {
    API_ROUTES: () => API_ROUTES,
    notification: state => { return state.notification }
  },
  mutations: {
    SET_NOTIFICATION (state, type, content) {
      console.log('Mutation : SET_NOTIFICATION=' + content)
      state.notification.visible = true
      state.notification.type = type || 'info'
      state.notification.header = content || ''
      state.notification.message = content || ''
    },
    CLOSE_NOTIFICATION (state) {
      console.log('Mutation : CLOSE_NOTIFICATION')
      state.notification.visible = false
      state.notification.type = 'info'
      state.notification.header = ''
      state.notification.message = ''
    },
    SET_USER_DATA (state, data) {
      console.log('Mutation : SET_USER_DATA=' + data)
      console.log(data)
    }
  },
  actions: {
    setNotification: (store, type, header, content) => store.commit('SET_NOTIFICATION', type, header, content),
    closeNotification: (store) => store.commit('CLOSE_NOTIFICATION'),
    setUserData: (store, data) => store.commit('SET_USER_DATA', data)
  },
  strict: true
})
