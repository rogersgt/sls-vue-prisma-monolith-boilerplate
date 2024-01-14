<template>
  <v-app-bar class="flex w-100">
    <!-- <v-app-bar-title>Road Dog</v-app-bar-title> -->
    <v-app-bar-nav-icon>
      <v-btn @click="toggleSideBar($event)">toggle</v-btn>
    </v-app-bar-nav-icon>
  </v-app-bar>


</template>

<script lang="ts">
import useNavStore from '@/stores/nav.store';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppNav',
  setup() {
    const navStore = useNavStore();
  
    const toggleSideBar = (e: MouseEvent) => {
      e.preventDefault();
      navStore.toggleSidePanel();
    };

    return {
      toggleSideBar
    }
  }
})
</script>