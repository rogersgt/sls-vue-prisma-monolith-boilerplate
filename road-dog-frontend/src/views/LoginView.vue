<script lang="ts">
import { defineComponent } from 'vue';
import { googleOneTap } from 'vue3-google-login';
import useAuthStore from '@/stores/auth.store';

export default defineComponent({
  name: 'LoginView',
  methods: {
    async login(e: MouseEvent) {
      e.preventDefault()
      try {
        await googleOneTap({
          autoLogin: true,
          clientId: import.meta.env.VITE_GOOGLE_APP_ID,
        });
      } catch (error) {
        console.log(error)
      }
    },
    callback({ code }: { code: string; prompt: string; scope: string; authuser: string }) {
      const authStore = useAuthStore()
      authStore.login(code).then(() => {
        // can't use vue-router here, so just redirecting via window
        window.location.pathname = '/'
      })
    }
  }
})
</script>

<template>
  <v-container class="w-25 mx-auto flex center bg-white ">
    <GoogleLogin :callback="callback" >
      <v-btn>Login with Google</v-btn>
    </GoogleLogin>
    <!-- <v-btn @click="login($event)">Login with Google</v-btn> -->
  </v-container>
</template>
