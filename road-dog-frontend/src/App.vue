<script lang="ts">
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router'
import AppNav from './components/AppNav.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppNav: AppNav,
    RouterView
  }
})
</script>

<template>
  <v-app>
    <app-nav></app-nav>
    <RouterView />
  </v-app>
</template>

<style scoped>
</style>
