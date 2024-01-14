<script lang="ts">
import { defineComponent } from 'vue';
import { googleOneTap } from 'vue3-google-login';
import useAuthStore from '@/stores/auth.store';

export default defineComponent({
  name: 'LoginView',
  data: () => ({
    loading: false
  }),
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
        this.loading = false;
        // can't use vue-router here, so just redirecting via window
        window.location.pathname = '/'
      })
    },
    showPendingState() {
      this.loading = true;
    }
  }
})
</script>

<template>
  <v-container class="w-25 mx-auto flex center bg-white rounded login-form">
    <div class="flex justify-content text-center content-center">
      <h1 class="mt-2">Sign in to Road Dog</h1>
      <GoogleLogin class="mt-2 mb-2" :callback="callback">
        <v-btn @click="showPendingState()" variant="elevated" class="bg-primary" :disabled="loading">
          <font-awesome-icon v-if="!loading" icon="fa-g" class="mr-2 font-weight-bold"></font-awesome-icon><span v-if="!loading">Login with Google</span>
          <font-awesome-icon v-if="loading" icon="fa-spinner" class="loader"></font-awesome-icon>
        </v-btn>
      </GoogleLogin>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
.login-form {
  min-width: 400px;
}
</style>