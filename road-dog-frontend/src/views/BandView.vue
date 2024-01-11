<template>
  <v-container></v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BandView',
  data: () => {
    return {
      bands: [{}]
    }
  }
})
</script>
