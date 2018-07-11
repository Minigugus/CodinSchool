<template>
<div>
  <form class="ui form" id="loginForm">
    <div class="field">
      <label for="username">Nom d'utilisateur</label>
      <input type="text" id="username" v-model="formData.username" placeholder="Nom d'utilisateur" />
    </div>
    <div class="field">
      <label for="password">Mot de passe</label>
      <input type="password" id="password" v-model="formData.password" placeholder="Mot de passe" />
    </div>
    <button class="ui button" type="submit" @click.prevent="checkLogin">Se connecter</button>
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
      }
    }
  },
  computed: {
    ...Vuex.mapGetters([
      'API_ROUTES'
    ])
  },
  methods: {
    ...Vuex.mapActions([
      'setUserData'
    ]),
    setErrorVisible (b) { // Show/hide error message
      this.error.visible = b
    },
    checkLogin () { // Test login form with server
      const apiCall = this.$store.state.apiCall
      const username = this.formData.username
      const password = this.formData.password
      if (!username || !password) {
        this.error.visible = true
        this.error.message = 'Le nom d\'utilisateur ou mot de passe est vide.'
        return
      }
      this.error.visible = false
      const apiLogin = this.API_ROUTES.login
      apiCall(null, apiLogin.path, apiLogin.method, {username, password})
        .then(res => res.json())
        .then(res => this.setUserData(res))
        .catch(_ => {
          this.error.visible = true
          this.error.message = 'Nom d\'utilisateur ou mot de passe incorrect.'
        })
    }
  }
}
</script>
