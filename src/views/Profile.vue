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
            <span>Adresse email : {{ getUserData.email }}</span>
            <button class="circular ui icon button primary mini"><i class="icon edit"></i></button>

            <div class="ui input mini"><input id="editEmail" type="text" placeholder="Adresse email" v-model="editable.email"></div>
            <button class="circular ui icon button positive mini" @click="sendToStore('email')">
              <i class="icon check"></i>
            </button>
          </div>
          <div class="extra">Roles :
            <span v-for="(role, index) in getUserData.roles" :key="index">{{ role }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex'

export default {
  name: 'Profile',
  data () {
    return {
      editable: {
        email: ''
      }
    }
  },
  mounted () { this.editable.email = this.getUserData.email },
  computed: {
    ...Vuex.mapGetters([
      'getUserData'
    ])
  },
  methods: {
    sendToStore (property) { return this.updateUserData({ property, content: this['editable'][property] }) },
    ...Vuex.mapActions([
      'updateUserData'
    ])
  }
}
</script>
