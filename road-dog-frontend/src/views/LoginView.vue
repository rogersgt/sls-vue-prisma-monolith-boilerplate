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
        console.log(import.meta.env.VITE_GOOGLE_APP_ID)
        const resp = await googleOneTap({
          autoLogin: true,
          clientId: import.meta.env.VITE_GOOGLE_APP_ID,
          callback(response) {
              console.log(response)
          },
        });
        console.log(resp);
      } catch (error) {
        console.log(error)
      }
    },
    callback({ code }: { code: string; prompt: string; scope: string; authuser: string }) {
      console.log(code)
      const authStore = useAuthStore()
      authStore.login(code)
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
