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
  { type: 'info', header: 'Information', icon: 'info circle' },
  { type: 'warning', header: 'Attention', icon: 'exclamation triangle' },
  { type: 'success', header: 'Succès', icon: 'check circle' },
  { type: 'error', header: 'Erreur', icon: 'exclamation circle' }
]
const httpCodesList = {
  200: true,
  404: false
}
const isHttpCodeGood = httpCode => (httpCodesList.hasOwnProperty(httpCode) && httpCodesList[httpCode])

const clearStorage = () => localStorage.clear()
const saveToStorage = (key, obj) => localStorage.setItem(key, JSON.stringify(obj))
const loadFromStorage = key => {
  try {
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key)) || undefined
    }
  } catch (error) { console.error(error) }
}

const isEmailValid = email => /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email)

module.exports = {
  debug,
  notificationTypes,
  isHttpCodeGood,
  API_ROUTES,
  apiCall,
  clearStorage,
  saveToStorage,
  loadFromStorage,
  isEmailValid
}
