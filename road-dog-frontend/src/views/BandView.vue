<template>
  <v-container></v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { } from '../types/types/'

export default defineComponent({
  name: 'BandView',
  data: () => {
    const bands: IBand
    return {
      bands: [{}]
    }
  }
})
</script>