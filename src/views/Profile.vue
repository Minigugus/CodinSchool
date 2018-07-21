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
              <div class="ui action input mini">
                <input id="firstname" type="text" placeholder="Prénom" v-model="editable.firstname.content">
              </div>
              <div class="ui action input mini">
                <input id="lastname" type="text" placeholder="Nom" v-model="editable.lastname.content" style="margin-right: 0px">
              </div>
              <button class="ui icon button positive" @click="sendToStore('firstname', 'lastname')">
                <i class="icon check"></i>
              </button>
            </div>
          </transition>

          <div class="meta">
            <div>
              <span>Adresse email : {{ getUserData.email }}</span>
            </div>
          </div>
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
        firstname: {
          content: '',
          editVisible: false
        },
        lastname: {
          content: '',
          editVisible: false
        }
      }
    }
  },
  mounted () {
    this.editable.firstname.content = this.getUserData.firstname
    this.editable.lastname.content = this.getUserData.lastname
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
      id.forEach(input => activateErr
        ? document.getElementById(input).parentElement.classList.add('error')
        : document.getElementById(input).parentElement.classList.remove('error'))
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
