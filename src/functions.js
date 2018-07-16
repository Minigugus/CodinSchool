const storeDebugMode = true
const debug = (...el) => storeDebugMode ? console.log(...el) : null

const API_PREFIX = 'http://localhost:3000/api'
const API_ROUTES = {
  login: { path: '/login', method: 'POST' }
}
const apiCall = (apiCallUrl, fetchMethod, fetchArgsObj, fetchHeadersObj) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: fetchMethod || 'GET',
      body: fetchArgsObj ? JSON.stringify(fetchArgsObj) : {},
      headers: fetchHeadersObj || {}
    }
    fetch(API_PREFIX + apiCallUrl, options)
      .then(res => isHttpCodeGood(res.status) ? resolve(res) : reject(res)) // Request sent successfully, check if it worked
      .catch(err => {
        reject(err)
      })
  })
}

const notificationTypes = [
  { type: 'info', header: 'Information' },
  { type: 'warning', header: 'Attention' },
  { type: 'success', header: 'Succès' },
  { type: 'error', header: 'Erreur' }
]
const httpCodesList = {
  200: true,
  404: false
}
const isHttpCodeGood = httpCode => (httpCodesList.hasOwnProperty(httpCode) && httpCodesList[httpCode])

const saveToStorage = (key, obj) => localStorage.setItem(key, JSON.stringify(obj))
const loadFromStorage = key => {
  try {
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key)) || undefined
    }
  } catch (error) { console.error(error) }
}

module.exports = {
  debug,
  notificationTypes,
  isHttpCodeGood,
  API_ROUTES,
  apiCall,
  saveToStorage,
  loadFromStorage
}
