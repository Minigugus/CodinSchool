<template>
  <div class="ui raised very padded text container segment">
    <h2 class="ui center aligned header">
      <i class="settings icon" style="display: inline;position: absolute;margin-left: -44px;margin-top: 7px;"></i>
      <div class="content" style="display: inline-block;">
        Codinschool
        <div class="sub header">Connexion</div>
      </div>
    </h2>
    <form class="ui form" id="loginForm">
      <div class="field">
        <label for="email">Adresse email</label>
        <input type="text" id="email" v-model="formData.email" placeholder="Adresse email" />
      </div>
      <div class="field">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="formData.password" placeholder="Mot de passe" />
      </div>
      <button class="ui button" :class="{ loading: buttonLoading }" type="submit" @click.prevent="checkForm">Se connecter</button>
    </form>

    <transition name="fade">
      <div class="ui negative message" v-show="error.visible">
        <i class="close icon" @click="showFormErrorMessage(false)"></i>
        <div class="header">
          Erreur
        </div>
        <ul class="list">
          <transition-group name="fade">
            <li v-for="(errMsg, index) in error.messages" :key="index">{{ errMsg }}</li>
          </transition-group>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import Vuex from 'vuex'
import {
  debug,
  apiCall,
  API_ROUTES,
  isEmailValid,
  isHttpCodeGood,
  getHttpMessage
} from '../assets/functions.js'

export default {
  name: 'Login',
  data () {
    return {
      formData: {
        email: 'test@test.com',
        password: 'test'
      },
      error: {
        visible: false,
        messages: []
      },
      buttonLoading: false
    }
  },
  methods: {
    ...Vuex.mapActions([
      'addNotification',
      'closeAllNotifications',
      'setUserData'
    ]),
    setInputError (activateErr, ...id) {
      id.forEach(input => activateErr
        ? document.getElementById(input).parentElement.classList.add('error')
        : document.getElementById(input).parentElement.classList.remove('error'))
    },
    setAllInputError (activateErr) { this.setInputError(activateErr, ...Object.keys(this.formData)) },

    addFormErrorMessage (message) { this.error.messages.push(message || 'Erreur inconnue.') },
    showFormErrorMessage (boolVisible) { this.error.visible = boolVisible },

    resetFormErrors () {
      this.setAllInputError(false)
      this.error.visible = false
      this.error.messages = []
    },

    checkAllInputCompleted () {
      let allInputCompleted = true
      Object.keys(this.formData).forEach(property => {
        if (!this.formData[property]) {
          this.setInputError(true, property)
          allInputCompleted = false
        }
      })
      if (!allInputCompleted) {
        this.addFormErrorMessage('Tous les champs sont obligatoires.')
        this.showFormErrorMessage(true)
      }
      return allInputCompleted
    },

    checkEmailField () {
      if (!isEmailValid(this.formData.email)) {
        this.addFormErrorMessage(`L'adresse email renseignée est invalide.`)
        this.showFormErrorMessage(true)
        this.setInputError(true, 'email')
        return false
      }
      return true
    },

    checkForm () {
      this.resetFormErrors()
      let sendForm = true
      if (!this.checkAllInputCompleted()) sendForm = false
      if (!this.checkEmailField()) sendForm = false
      if (!sendForm) return

      // Form ready to be sent
      this.buttonLoading = true

      const httpCodesList = {
        200: { ok: true, message: 'Vous êtes connecté.' },
        403: { ok: false, message: 'Adresse email ou mot de passe incorrect.' }
      }
      const api = API_ROUTES.login
      apiCall(api.path, api.method, {
        email: this.formData.email,
        password: this.formData.password
      })
        .then(res => {
          this.buttonLoading = false
          if (!isHttpCodeGood(httpCodesList, res.status)) {
            this.addFormErrorMessage(getHttpMessage(httpCodesList, res.status))
            this.showFormErrorMessage(true)
            this.setAllInputError(true)
            return
          }
          this.closeAllNotifications()
          this.addNotification({ type: 'success', message: getHttpMessage(httpCodesList, res.status) })
          return res.json()
        })
        .then(res => {
          if (res) {
            debug(res)
            this.setUserData(res)
          }
        })
        .catch(debug)
    }
  }
}
</script>
