<template>
  <div :class="{
    'h-screen side-bar': true,
    'side-bar-open': sidePanelOpen
  }">
    <img src="@/assets/default-group-image.webp" alt="No image">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useNavStore from '@/stores/nav.store';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'SettingsSidePanel',
  setup() {
    const navStore = useNavStore();
    const { sidePanelOpen } = storeToRefs(navStore);
    return {
      sidePanelOpen
    }
  }
})
</script>

<style lang="scss">
.side-bar {
  position: fixed;
  transition: 0.5s;
  margin-left: -25%;
}

.side-bar-open {
  margin-left: 0;
}
</style>