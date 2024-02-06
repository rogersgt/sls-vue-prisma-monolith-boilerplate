<template>
  <v-app-bar class="d-flex bg-primary-darken-4 nav">
    <v-btn class="bg-transparent" variant="flat" @click="toggleSideBar($event)">
      <font-awesome-icon icon="fa-bars" class="text-white"></font-awesome-icon>
    </v-btn>
    <img class="w-25" src="@/assets/Road Dog_Official_LOGO_020124-04.png" alt="Road Dog">
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