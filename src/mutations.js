import {
  notificationTypes,
  debug
} from './functions.js'

const RESET_ALL_DATA = state => {
  debug(`Mutation : RESET_DATA`)
  state.notifications = []
  state.userData = {}
}

// notif = { type: 'info/warning/success/error', message: String }
const ADD_NOTIFICATION = (state, notif) => {
  let notifTypeData = ''
  // Check if type exists and get its corresponding header text
  if (notif.type && notif.message && (notifTypeData = notificationTypes.find(x => x.type === notif.type))) {
    notif = {
      id: state.notifications.length === 0 ? 0 : state.notifications[state.notifications.length - 1].id + 1,
      type: notif.type,
      icon: notifTypeData.icon,
      header: notifTypeData.header,
      message: notif.message
    }
    debug(`Mutation : ADD_NOTIFICATION=type:${notif.type}, message:${notif.message}`)
    state.notifications.push(notif)
  }
}

const CLOSE_NOTIFICATION = (state, id) => {
  let index = -1
  if ((index = state.notifications.findIndex(x => x.id === id)) >= 0) {
    debug(`Mutation : CLOSE_NOTIFICATION=index:${index}, index:${index}`)
    state.notifications.splice(index, 1)
  }
}

const CLOSE_ALL_NOTIFICATIONS = state => {
  debug(`Mutation : CLOSE_ALL_NOTIFICATIONS`)
  state.notifications = []
}

const SET_USER_DATA = (state, data) => {
  debug(`Mutation : SET_USER_DATA=`, data)
  state.userData = data
}

const UPDATE_USER_DATA = (state, data) => {
  data.forEach(x => { state.userData[x.property] = x.content })
  debug(`Mutation : UPDATE_USER_DATA=`, data)
}

const RESET_USER_DATA = state => {
  debug(`Mutation : DISCONNECT_USER`)
  state.userData = {}
}

export default {
  ADD_NOTIFICATION,
  RESET_ALL_DATA,
  CLOSE_NOTIFICATION,
  CLOSE_ALL_NOTIFICATIONS,
  SET_USER_DATA,
  UPDATE_USER_DATA,
  RESET_USER_DATA
}
