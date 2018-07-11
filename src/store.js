import Vue from 'vue'
import Vuex from 'vuex'

const httpCodesList = {
  200: true,
  404: false
}
const isHttpCodeGood = httpCode => (httpCodesList.hasOwnProperty(httpCode) && httpCodesList[httpCode])

const API_PREFIX = 'http://localhost:3000/api'
const API_ROUTES = {
  login: {path: '/login', method: 'POST'}
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
    apiCall,
    userData: {
      username: ''
    }
  },
  getters: {
    API_ROUTES: () => API_ROUTES
  },
  mutations: {
    SET_USER_DATA: (state, data) => {
      console.log('mutations looool')
      console.log(data)
      // state.userData.username = data
    }
  },
  actions: {
    setUserData: (store, data) => store.commit('SET_USER_DATA', data)
  },
  strict: true
})
