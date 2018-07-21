<template>
  <div class="ui raised very padded text container segment">
    <h2 class="ui center aligned header">
      <i class="settings icon" style="display: inline;position: absolute;margin-left: -44px;margin-top: 7px;"></i>
      <div class="content" style="display: inline-block;">
        Codinschool
        <div class="sub header">Inscription</div>
      </div>
    </h2>
    <form class="ui form" id="loginForm">
      <div class="field">
        <div class="two fields">
          <div class="field">
            <label for="lastname">Nom</label>
            <input type="text" id="lastname" v-model="formData.lastname" placeholder="Nom">
          </div>
          <div class="field">
            <label for="firstname">Prénom</label>
            <input type="text" id="firstname" v-model="formData.firstname" placeholder="Prénom">
          </div>
        </div>
      </div>
      <div class="field">
        <label for="email">Adresse email</label>
        <input type="text" id="email" v-model="formData.email" placeholder="Adresse email" />
      </div>
      <div class="field">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="formData.password" placeholder="Mot de passe" />
      </div>
      <div class="field">
        <label for="passwordConfirm">Confirmation du mot de passe</label>
        <input type="password" id="passwordConfirm" v-model="formData.passwordConfirm" placeholder="Confirmation du mot de passe" />
      </div>
      <button class="ui button" :class="{ loading: buttonLoading }" type="submit" @click.prevent="checkForm">S'inscrire</button>
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
} from '../functions.js'

export default {
  name: 'Register',
  data () {
    return {
      formData: {
        firstname: 'Antoine',
        lastname: 'Sauvage',
        email: 'test@test.com',
        password: 'test',
        passwordConfirm: 'test'
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
      'addNotification'
    ]),
    setInputError (activateErr, ...id) {
      id.forEach(input => activateErr
        ? document.getElementById(input).parentElement.classList.add('error')
        : document.getElementById(input).parentElement.classList.remove('error'))
    },
    setAllInputError (activateErr) { this.setInputError(activateErr, ...Object.keys(this.formData)) },

    addFormErrorMessage (message) { this.error.messages.push(message) },
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

    checkPasswordConfirmation () {
      if (this.formData.password !== this.formData.passwordConfirm) {
        this.addFormErrorMessage(`Les mots de passes ne correspondent pas.`)
        this.showFormErrorMessage(true)
        this.setInputError(true, 'password', 'passwordConfirm')
        return false
      }
      return true
    },

    checkForm () {
      this.resetFormErrors()
      let sendForm = true
      if (!this.checkAllInputCompleted()) sendForm = false
      if (!this.checkEmailField()) sendForm = false
      if (!this.checkPasswordConfirmation()) sendForm = false
      if (!sendForm) return

      // Form ready to be sent
      this.buttonLoading = true

      const httpCodesList = {
        201: { ok: true, message: 'Vous êtes inscrit.' },
        409: { ok: false, message: `L'adresse email renseignée est déjà enregistrée.` }
      }
      const api = API_ROUTES.register
      apiCall(api.path, api.method, {
        firstname: this.formData.firstname,
        lastname: this.formData.lastname,
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
          this.addNotification({ type: 'success', message: getHttpMessage(httpCodesList, res.status) })
          return res.json()
        })
        .then(res => {
          if (res) debug(res)
        })
        .catch(debug)
    }
  }
}
</script>
