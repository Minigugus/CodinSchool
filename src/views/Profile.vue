<template>
  <div class="ui raised very padded text container segment">
    <h2 class="ui center aligned header">
      <i class="user icon" style="display: inline;position: absolute;margin-left: -44px;margin-top: 7px;"></i>
      <div class="content" style="display: inline-block;">
        Mon profil
      </div>
    </h2>

    <div class="ui items text-center">
      <img class="ui circular image" :src="getUserData.avatar" style="display: inline;">
      <div class="item">
        <div class="content">
          <transition name="fade-right" mode="out-in">
            <div v-if="!editable.firstname.editVisible && !editable.lastname.editVisible" key="name-content">
              <a class="profileHeader">{{ `${getUserData.firstname} ${getUserData.lastname}` }} </a>
              <button class="circular ui icon button primary mini" @click="showEditInput(true, 'firstname', 'lastname')">
                <i class="icon edit"></i>
              </button>
            </div>

            <div v-else key="name-input">
              <div id="firstname" class="ui input mini">
                <input type="text" placeholder="Prénom" v-model="editable.firstname.content">
              </div>
              <div id="lastname" class="ui action input mini">
                <input type="text" placeholder="Nom" v-model="editable.lastname.content" style="margin-right: 0px">
              </div>
              <button class="ui icon button positive" @click="sendToStore('firstname', 'lastname')">
                <i class="icon check"></i>
              </button>
            </div>
          </transition>

          <table class="ui celled striped table">
            <tbody>
              <tr>
                <td><i class="folder icon"></i> Adresse email</td>
                <td class="center aligned">
                  <transition name="fade-right" mode="out-in">
                    <div v-if="!editable.email.editVisible" key="email-content">{{ getUserData.email }}</div>

                    <div v-else key="email-input" id="email" class="ui action input mini">
                      <input type="text" placeholder="Nom" v-model="editable.email.content">
                      <button class="ui icon button positive" @click="sendToStore('email')"><i class="icon check"></i></button>
                    </div>
                  </transition>
                </td>
                <td class="center aligned">
                  <button class="ui icon button primary mini" @click="showEditInput(true, 'email')">
                    Modifier <i class="icon edit"></i>
                  </button>
                </td>
              </tr>

              <tr>
                <td><i class="key icon"></i> Mot de passe</td>
                <td class="center aligned">
                  <transition name="fade-right" mode="out-in">
                    <div v-if="!editable.password.editVisible" key="password-content">••••••••</div>

                    <div v-else key="password-input" id="password" class="ui action input mini">
                      <input type="text" placeholder="Nom" v-model="editable.password.content">
                      <button class="ui icon button positive" @click="sendToStore('password')"><i class="icon check"></i></button>
                    </div>
                  </transition>
                </td>
                <td class="center aligned">
                  <button class="ui icon button primary mini" @click="showEditInput(true, 'password')">
                    Modifier <i class="icon edit"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="extra">Roles :
            <span v-for="(role, index) in getUserData.roles" :key="index">{{ role }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .profileHeader {
    font-weight:700;
    font-size:1.2em;
    color:black;
  }
  /* START Notification container animation*/

  .fade-right-enter-active,
  .fade-right-leave-active {
    transition: all .3s !important;
  }

  .fade-right-enter {
    transform: translateX(30px) !important;
    opacity: 0 !important;
  }
  .fade-right-leave-to {
    transform: translateX(-30px) !important;
    opacity: 0 !important;
  }

  /* END Notification container animation*/
</style>

<script>
import Vuex from 'vuex'
// import { isEmailValid } from '../functions.js'

export default {
  name: 'Profile',
  data () {
    return {
      editable: {
        firstname: { content: '', editVisible: false },
        lastname: { content: '', editVisible: false },
        email: { content: '', editVisible: false },
        password: { content: '', editVisible: false }
      }
    }
  },
  mounted () {
    this.editable.firstname.content = this.getUserData.firstname
    this.editable.lastname.content = this.getUserData.lastname
    this.editable.email.content = this.getUserData.email
  },
  computed: {
    ...Vuex.mapGetters([
      'getUserData'
    ])
  },
  methods: {
    ...Vuex.mapActions([
      'addNotification',
      'updateUserData'
    ]),
    setInputError (activateErr, ...id) {
      console.log(id)
      id.forEach(input => {
        if (activateErr && document.getElementById(input) !== null) {
          console.log(document.getElementById(input))
          document.getElementById(input).classList.add('error')
          document.getElementById(input).classList.remove('error')
        }
      })
    },
    setAllInputError (activateErr) { this.setInputError(activateErr, ...Object.keys(this.editable)) },
    showEditInput (boolShow, ...properties) { properties.forEach(property => { this.editable[property].editVisible = boolShow }) },
    sendToStore (...properties) {
      /*
      if (property === 'email' && !isEmailValid(this.editable[property].content)) {
        this.addNotification({ type: 'error', message: `L'adresse email renseignée est invalide.` })
        setInputError(true, 'editEmail')
        return
      }
      */
      this.setAllInputError(false)
      this.showEditInput(false, ...properties)
      const data = properties.map(property => ({ property, content: this.editable[property].content }))
      this.updateUserData(data)
    }
  }
}
</script>
