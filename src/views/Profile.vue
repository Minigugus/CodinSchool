<template>
  <div class="ui raised very padded text container segment">
    <h2 class="ui center aligned header">
      <div class="content">
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

                    <div v-else :key="index + '-input'" class="ui form" :class="{ loading: data.loading }">
                      <div class="field" :class="{ error: data.error }">
                        <label>{{ data.title }}</label>
                        <input type="text" class="text-center" :placeholder="data.title" v-model="data.content">
                      </div>
                    </div>
                  </transition>
                </td>
                <td class="center aligned">
                  <transition name="fade" mode="out-in">
                  <button v-if="!data.editVisible" :key="index + '-modify'" class="ui icon button primary mini" @click="showEditInput(true, index)">
                    Modifier <i class="icon edit"></i>
                  </button>

                  <button v-else :key="index + '-validate'"
                  :class="{ loading: data.loading, disabled: data.loading }"
                  class="ui icon button positive mini"
                  @click="sendToStore(index)">
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

                    <div v-else key="password-input">
                      <div class="ui form" :class="{ loading: editableSpecial.password.loading }">
                        <div class="field" :class="{error: editableSpecial.password.old.error }">
                          <label>Ancien mot de passe</label>
                          <input type="password" class="text-center" placeholder="Ancien mot de passe" v-model="editableSpecial.password.old.content">
                        </div>
                        <div class="field" :class="{error: editableSpecial.password.new.error }">
                          <label>Nouveau mot de passe</label>
                          <input type="password" class="text-center" placeholder="Nouveau mot de passe" v-model="editableSpecial.password.new.content">
                        </div>
                        <div class="field" :class="{error: editableSpecial.password.confirm.error }">
                          <label>Confirmation du mot de passe</label>
                          <input type="password" class="text-center" placeholder="Confirmation du mot de passe" v-model="editableSpecial.password.confirm.content">
                        </div>
                      </div>
                    </div>
                  </transition>
                </td>
                <td class="center aligned">
                  <transition name="fade" mode="out-in">
                  <button v-if="!editableSpecial.password.editVisible"
                  key="password-modify"
                  @click="editableSpecial.password.editVisible = true"
                  class="ui icon button primary mini">
                    Modifier <i class="icon edit"></i>
                  </button>

                  <button v-else key="password-validate"
                  :class="{ loading: editableSpecial.password.loading, disabled: editableSpecial.password.loading }"
                  class="ui icon button positive mini"
                  @click="sendPasswordToStore()">
                    Valider <i class="icon check"></i>
                  </button>
                  </transition>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="extra">Roles :
            <template v-for="(role, index) in getUserData.roles">
              {{ role }}{{ getUserData.roles.length - 1 === index ? '' : ',' }}
            </template>
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
import { isEmailValid } from '../assets/functions.js'

export default {
  name: 'Profile',
  data () {
    return {
      editable: {
        lastname: {
          title: 'Nom',
          icon: 'user',
          content: '',
          editVisible: false,
          error: false,
          loading: false
        },
        firstname: {
          title: 'Prénom',
          icon: 'user',
          content: '',
          editVisible: false,
          error: false,
          loading: false
        },
        email: {
          title: 'Adresse email',
          icon: 'envelope',
          content: '',
          editVisible: false,
          error: false,
          loading: false
        }
      },
      editableSpecial: {
        password: {
          title: 'Mot de passe',
          icon: 'key',
          editVisible: false,
          loading: false,
          old: { content: '', error: false },
          new: { content: '', error: false },
          confirm: { content: '', error: false }
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
    setInputError (activateErr, ...properties) { properties.forEach(property => { this.editable[property].error = activateErr }) },
    showEditInput (boolShow, ...properties) { properties.forEach(property => { this.editable[property].editVisible = boolShow }) },
    setInputLoading (boolShow, ...properties) { properties.forEach(property => { this.editable[property].loading = boolShow }) },

    setInputErrorPassword (activateErr, ...properties) { properties.forEach(property => { this.editableSpecial.password[property].error = activateErr }) },
    setInputLoadingPassword (boolShow) { this.editableSpecial.password.loading = boolShow },

    sendEmailToStore () {
      if (!isEmailValid(this.editable.email.content)) {
        this.addNotification({ type: 'error', message: 'bad_email_format' })
        this.setInputError(true, 'email')
        return
      }
      this.sendToStore('email')
    },

    sendPasswordToStore () {
      this.setInputErrorPassword(false, 'old', 'new', 'confirm')
      this.setInputLoadingPassword(false)
      let sendData = true
      Object.keys(this.editableSpecial.password).forEach(key => {
        if (this.editableSpecial.password[key].hasOwnProperty('content') && this.editableSpecial.password[key].content === '') {
          this.setInputErrorPassword(true, key)
          sendData = false
        }
      })
      if (!sendData) {
        this.addNotification({ type: 'warning', message: 'all_fields_mandatory' })
        return
      }
      if (this.editableSpecial.password.new.content === this.editableSpecial.password.confirm.content) {
        this.setInputLoadingPassword(true)
        const data = [
          { property: 'old', content: this.editableSpecial.password.old.content },
          { property: 'new', content: this.editableSpecial.password.new.content }
        ]
        this.updateUserData(data)
          .then(success => {
            this.setInputLoadingPassword(false)
            if (success) {
              this.setInputErrorPassword(false, 'old', 'new', 'confirm')
              this.editableSpecial.password.editVisible = false
            } else {
              this.setInputErrorPassword(true, 'old', 'new', 'confirm')
            }
          })
          .catch(() => {
            this.setInputLoadingPassword(false)
            this.setInputErrorPassword(true, 'old', 'new', 'confirm')
          })
      } else {
        this.setInputErrorPassword(true, 'new', 'confirm')
        this.addNotification({ type: 'error', message: 'not_same_password' })
      }
    },

    sendToStore (...properties) {
      this.setInputError(false, ...properties)
      this.setInputLoading(false, ...properties)
      let sendData = true
      const data = properties.map(property => {
        if (this.editable[property].content === '') {
          sendData = false
          this.setInputError(true, property)
        }
        return { property, content: this.editable[property].content }
      })
      if (!sendData) {
        this.addNotification({ type: 'warning', message: 'all_fields_mandatory' })
        return
      }
      this.setInputLoading(true, ...properties)
      this.updateUserData(data)
        .then(success => {
          this.setInputLoading(false, ...properties)
          if (success) {
            this.showEditInput(false, ...properties)
          } else {
            this.setInputError(true, ...properties)
          }
        })
        .catch(() => {
          this.setInputLoading(false, ...properties)
          this.setInputError(true, ...properties)
        })
    }
  }
}
</script>
