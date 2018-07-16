<template>
  <div class="ui raised very padded text container segment">
    <h2 class="ui center aligned header">
      <i class="settings icon" style="display: inline;position: absolute;margin-left: -44px;margin-top: 7px;"></i>
      <div class="content" style="display: inline-block;">
        Codinschool
        <div class="sub header">Se connecter</div>
      </div>
    </h2>
    <form class="ui form" id="loginForm">
      <div class="field">
        <label for="username">Nom d'utilisateur</label>
        <input type="text" id="username" v-model="formData.username" placeholder="Nom d'utilisateur" />
      </div>
      <div class="field">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="formData.password" placeholder="Mot de passe" />
      </div>
      <button class="ui button" v-bind:class="{ loading: buttonLoading }" type="submit" @click.prevent="checkLogin">Se connecter</button>
    </form>
    <div class="ui negative message transition" v-show="error.visible">
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

const setInputError = (activateErr, ...ele) => ele.forEach(input => activateErr
  ? input.parentElement.classList.add('error')
  : input.parentElement.classList.remove('error'))

export default {
  name: 'Login',
  data () {
    return {
      formData: {
        username: '',
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
      const username = {data: this.formData.username, ele: document.getElementById('username')}
      const password = {data: this.formData.password, ele: document.getElementById('password')}
      setInputError(!username.data, username.ele)
      setInputError(!password.data, password.ele)
      if (!username.data || !password.data) {
        this.error.visible = true
        this.error.message = 'Le nom d\'utilisateur ou mot de passe est vide.'
        return
      }
      setInputError(false, username.ele, password.ele)
      this.error.visible = false
      this.buttonLoading = true

      const apiLogin = API_ROUTES.login
      apiCall(apiLogin.path, apiLogin.method, { username: username.data, password: password.data })
        .then(res => res.json())
        .then(res => {
          this.buttonLoading = false
          return this.setUserData(res)
        })
        .catch(_ => {
          this.buttonLoading = false
          this.error.visible = true
          this.error.message = 'Nom d\'utilisateur ou mot de passe incorrect.'
          setInputError(true, username.ele, password.ele)
        })
    }
  }
}
</script>
