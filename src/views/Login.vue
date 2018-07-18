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
      <button class="ui button" :class="{ loading: buttonLoading }" type="submit" @click.prevent="checkLogin">Se connecter</button>
    </form>
    <div class="ui negative message" v-show="error.visible">
      <i class="close icon" @click="setErrorVisible(false)"></i>
      <div class="header">
        Erreur
      </div>
      <p>{{ error.message }}</p>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex'
import { apiCall, API_ROUTES } from '../functions.js'

const setInputError = (activateErr, ...id) => id.forEach(input => activateErr
  ? document.getElementById(id).parentElement.classList.add('error')
  : document.getElementById(id).parentElement.classList.remove('error'))

export default {
  name: 'Login',
  data () {
    return {
      formData: {
        email: '',
        password: ''
      },
      error: {
        visible: false,
        message: ''
      },
      buttonLoading: false
    }
  },
  methods: {
    ...Vuex.mapActions([
      'setUserData'
    ]),
    // Show/hide error message
    setErrorVisible (boolVisible) { this.error.visible = boolVisible },
    // Test login form with server
    checkLogin () {
      const email = this.formData.email
      const password = this.formData.password
      setInputError(!email, 'email')
      setInputError(!password, 'password')
      if (!email.data || !password.data) {
        this.error.visible = true
        this.error.message = 'Adresse email ou mot de passe vide.'
        return
      }
      setInputError(false, 'email', 'password')
      this.error.visible = false
      this.buttonLoading = true

      const apiLogin = API_ROUTES.login
      apiCall(apiLogin.path, apiLogin.method, { email, password })
        .then(res => res.json())
        .then(res => {
          this.buttonLoading = false
          return this.setUserData(res)
        })
        .catch(_ => {
          this.buttonLoading = false
          this.error.visible = true
          this.error.message = 'Adresse email ou mot de passe incorrect.'
          setInputError(true, 'email', 'password')
        })
    }
  }
}
</script>
