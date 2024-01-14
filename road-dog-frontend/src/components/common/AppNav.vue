<template>
  <v-app-bar class="d-flex bg-white">
    <v-btn variant="flat" @click="toggleSideBar($event)">
      <font-awesome-icon icon="fa-bars" class="text-primary"></font-awesome-icon>
    </v-btn>
    <h1 class="m-0 text-primary">Road Dog</h1>
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