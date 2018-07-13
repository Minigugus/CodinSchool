<template>
  <div class="about">
    <h1>This is the profile page</h1>
  </div>
</template>

<script>
import Vuex from 'vuex'
export default {
  name: 'Profile',
  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      notification: {
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
    }
  }
}
</script>
