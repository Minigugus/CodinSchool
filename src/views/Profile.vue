<template>
  <div class="ui raised very padded text container segment">
    <h2 class="ui center aligned header">
      <div class="content" style="display: inline-block;">
        {{ `${getUserData.firstname} ${getUserData.lastname}` }}
      </div>
    </h2>

    <div class="ui items text-center">
      <img class="ui circular image" :src="getUserData.avatar" style="display: inline;">
      <div class="item">
        <div class="content">
          <table class="ui celled striped table">
            <tbody>
              <tr v-for="(data, index) in editable" :key="index">
                <td><i class="icon" :class="data.icon"></i> {{data.title}}</td>
                <td class="center aligned">
                  <transition name="fade-right" mode="out-in">
                    <div v-if="!data.editVisible" :key="index + '-content'">{{ getUserData[index] }}</div>

                    <div v-else :key="index + '-input'" :id="index" class="ui input mini editDataInput">
                      <input type="text" :placeholder="data.title" class="text-center" v-model="data.content">
                    </div>
                  </transition>
                </td>
                <td class="center aligned">
                  <transition name="fade" mode="out-in">
                  <button v-if="!data.editVisible" :key="index + '-modify'" class="ui icon button primary mini" @click="showEditInput(true, index)">
                    Modifier <i class="icon edit"></i>
                  </button>

                  <button v-else :key="index + '-validate'" class="ui icon button positive mini" @click="sendToStore(index)">
                    Valider <i class="icon check"></i>
                  </button>
                  </transition>
                </td>
              </tr>

              <tr>
                <td><i class="key icon"></i> Mot de passe</td>
                <td class="center aligned">
                  <transition name="fade-right" mode="out-in">
                    <div v-if="!editableSpecial.password.editVisible" key="password-content">••••••••</div>

                    <div v-else key="password-input" id="password" class="ui input mini editDataInput">
                      <input type="text" placeholder="Ancien mot de passe" v-model="editableSpecial.password.old">
                    </div>
                  </transition>
                </td>
                <td class="center aligned">
                  <transition name="fade" mode="out-in">
                  <button v-if="!editableSpecial.password.editVisible" key="password-modify" class="ui icon button primary mini" @click="editableSpecial.password.editVisible = true">
                    Modifier <i class="icon edit"></i>
                  </button>

                  <button v-else key="password-validate" class="ui icon button positive mini" @click="sendToStore('password')">
                    Valider <i class="icon check"></i>
                  </button>
                  </transition>
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
  .editDataInput {
    height: 28px;
  }
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
// import { isEmailValid } from '../assets/functions.js'

export default {
  name: 'Profile',
  data () {
    return {
      editable: {
        lastname: {
          title: 'Nom',
          icon: 'user',
          content: '',
          editVisible: false
        },
        firstname: {
          title: 'Prénom',
          icon: 'user',
          content: '',
          editVisible: false
        },
        email: {
          title: 'Adresse email',
          icon: 'envelope',
          content: '',
          editVisible: false
        }
      },
      editableSpecial: {
        password: {
          title: 'Mot de passe',
          icon: 'key',
          old: '',
          new: '',
          confirm: '',
          editVisible: false
        }
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
          document.getElementById(input).classList.add('error')
          document.getElementById(input).classList.remove('error')
        }
      })
    },
    setAllInputError (activateErr) { this.setInputError(activateErr, ...Object.keys(this.editable)) },
    showEditInput (boolShow, ...properties) { properties.forEach(property => { this.editable[property].editVisible = boolShow }) },
    sendToStore (...properties) {
      // if (property === 'email' && !isEmailValid(this.editable[property].content)) {
      //   this.addNotification({ type: 'error', message: `L'adresse email renseignée est invalide.` })
      //   setInputError(true, 'editEmail')
      //   return
      // }
      this.setAllInputError(false)
      this.showEditInput(false, ...properties)
      const data = properties.map(property => ({ property, content: this.editable[property].content }))
      this.updateUserData(data)
    }
  }
}
</script>
