<template>
  <v-app-bar class="d-flex bg-white nav">
    <v-btn variant="flat" @click="toggleSideBar($event)">
      <font-awesome-icon icon="fa-bars" class="text-primary"></font-awesome-icon>
    </v-btn>
    <img class="w-25" src="@/assets/Road Dog_Official_LOGO_020124-03.png" alt="Road Dog">
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

<style lang="scss">
.nav {
  img {
    max-width: 200px;
  }
}
</style>