<script lang="ts">
import { defineComponent, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router'
import AppNav from './components/common/AppNav.vue';
import SettingsSidePanel from './components/common/SettingsSidePanel.vue';
import { computed } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    AppNav: AppNav,
    RouterView,
    SettingsSidePanel
  },
  setup() {
    const router = useRouter();
    const showNav = computed(() => {
      return router.currentRoute.value.name !== 'login';
    })


    return {
      showNav
    }
  }
})
</script>

<template>
  <v-app class="bg-black">
    <app-nav v-if="showNav"></app-nav>
    <SettingsSidePanel v-if="showNav" />
    <div class="mx-0 mt-14 w-100 mx-auto">
      <RouterView />
    </div>
  </v-app>
</template>
