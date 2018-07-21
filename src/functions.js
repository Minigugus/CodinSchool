const productionMode = process.env.NODE_ENV === 'production'
const debug = (...el) => (!productionMode && console.log(...el))

const isHttpCodeGood = (httpCodesList, httpCode) => (httpCodesList.hasOwnProperty(httpCode) && httpCodesList[httpCode].ok)
const getHttpMessage = (httpCodesList, httpCode) => httpCodesList.hasOwnProperty(httpCode) ? httpCodesList[httpCode].message : ''

const API_PREFIX = `${productionMode ? '/api' : 'http://localhost:3000/api'}`
const API_ROUTES = {
  register: { path: '/register', method: 'POST' },
  login: { path: '/login', method: 'POST' },
  logout: { path: '/logout', method: 'POST' },
  updateProfile: { path: '/users/@me', method: 'PATCH' }
}
const apiCall = (apiCallUrl, fetchMethod, fetchArgsObj, fetchHeadersObj) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: fetchMethod || 'GET',
      body: fetchArgsObj ? JSON.stringify(fetchArgsObj) : {},
      headers: fetchHeadersObj || {}
    }
    options.headers['Content-Type'] = 'application/json'
    fetch(API_PREFIX + apiCallUrl, options)
      .then(res => resolve(res)) // Request sent successfully, check if it worked
      .catch(err => reject(err))
  })
}

const notificationTypes = [
  { type: 'info', header: 'Information', icon: 'info circle' },
  { type: 'warning', header: 'Attention', icon: 'exclamation triangle' },
  { type: 'success', header: 'Succès', icon: 'check circle' },
  { type: 'error', header: 'Erreur', icon: 'exclamation circle' }
]

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

const stripHtml = str => str.replace(/[\u00A0-\u9999<>&]/gim, i => '&#' + i.charCodeAt(0) + ';')
const stripObjHtml = obj => {
  const temp = {}
  for (let x in obj) {
    if (typeof obj[x] === 'string') temp[x] = stripHtml(obj[x])
    else temp[x] = obj[x]
  }
  return temp
}

export {
  debug,
  notificationTypes,
  isHttpCodeGood,
  getHttpMessage,
  API_ROUTES,
  apiCall,
  clearStorage,
  saveToStorage,
  loadFromStorage,
  isEmailValid,
  stripHtml,
  stripObjHtml
}
