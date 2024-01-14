<script lang="ts">
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router'
// import AppNav from './components/common/AppNav.vue';

export default defineComponent({
  name: 'App',
  components: {
    // AppNav: AppNav,
    RouterView
  }
})
</script>

<template>
  <v-app class="bg-black">
    <!-- <app-nav></app-nav> -->
    <div class="mx-0 mt-14 w-100 mx-auto">
      <RouterView />
    </div>
  </v-app>
</template>

<style scoped>
</style>
