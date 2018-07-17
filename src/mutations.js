import {
  clearStorage,
  saveToStorage,
  notificationTypes,
  debug
} from './functions.js'

const ADD_NOTIFICATION = (state, notif) => {
  let notifTypeData = ''
  // Check if type exists and get its corresponding header text
  if (notif.type && notif.message && (notifTypeData = notificationTypes.find(x => x.type === notif.type))) {
    debug(`Mutation : ADD_NOTIFICATION=type:${notif.type}, message:${notif.message}`)
    state.notifications.push({
      id: state.notifications.length === 0 ? 0 : state.notifications[state.notifications.length - 1].id + 1,
      type: notif.type,
      icon: notifTypeData.icon,
      header: notifTypeData.header,
      message: notif.message
    })
    saveToStorage('notifications', state.notifications)
  }
}

const RESET_DATA = (state) => {
  state.notifications = []
  state.userData = {}
  clearStorage()
}

const CLOSE_NOTIFICATION = (state, id) => {
  let index = -1
  if ((index = state.notifications.findIndex(x => x.id === id)) >= 0) {
    debug(`Mutation : CLOSE_NOTIFICATION=id:${id}, index:${index}`)
    state.notifications.splice(index, 1)
    saveToStorage('notifications', state.notifications)
  }
}

const CLOSE_ALL_NOTIFICATIONS = (state) => {
  debug(`Mutation : CLOSE_ALL_NOTIFICATIONS`)
  state.notifications = []
  saveToStorage('notifications', state.notifications)
}

const SET_USER_DATA = (state, data) => {
  debug(`Mutation : SET_USER_DATA=`, data)
  state.userData = data
  saveToStorage('userData', state.userData)
}

const UPDATE_USER_DATA = (state, data) => {
  debug(`Mutation : UPDATE_USER_DATA=`, data)
  state.userData[data.property] = data.content
  saveToStorage('userData', state.userData)
  ADD_NOTIFICATION(state, { type: 'success', message: 'Les données ont bien été mises à jour.' })
}

export default {
  ADD_NOTIFICATION,
  RESET_DATA,
  CLOSE_NOTIFICATION,
  CLOSE_ALL_NOTIFICATIONS,
  SET_USER_DATA,
  UPDATE_USER_DATA
}
