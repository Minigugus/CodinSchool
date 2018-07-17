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
          <a class="header">{{ `${getUserData.firstname} ${getUserData.lastname}` }}</a>
          <div class="meta">
            <transition name="fade-right" mode="out-in">
              <div v-if="!editable.email.editVisible" key="email-content">
                <span>Adresse email : {{ getUserData.email }}</span>
                <button class="circular ui icon button primary mini" @click="showEditInput('email', true)"><i class="icon edit"></i></button>
              </div>

              <div v-else key="email-input">
                <div class="ui action input mini">
                  <input id="editEmail" type="text" placeholder="Adresse email" v-model="editable.email.content" style="margin-right: 0px">
                  <button class="ui icon button positive" @click="sendToStore('email')">
                    <i class="icon check"></i>
                  </button>
                </div>
              </div>
            </transition>
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
import { isEmailValid } from '../functions.js'

const setInputError = (activateErr, ...id) => id.forEach(input => activateErr
  ? document.getElementById(id).parentElement.classList.add('error')
  : document.getElementById(id).parentElement.classList.remove('error'))

export default {
  name: 'Profile',
  data () {
    return {
      editable: {
        email: {
          content: '',
          editVisible: false
        }
      }
    }
  },
  mounted () { this.editable.email.content = this.getUserData.email },
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
    showEditInput (property, boolShow) { this.editable[property].editVisible = boolShow },
    sendToStore (property) {
      if (property === 'email' && !isEmailValid(this.editable[property].content)) {
        this.addNotification({ type: 'error', message: `L'adresse email renseignée est incorrecte.` })
        setInputError(true, 'editEmail')
        return
      }
      setInputError(false, 'editEmail')
      this.showEditInput(property, false)
      return this.updateUserData({ property, content: this.editable[property].content })
    }
  }
}
</script>
