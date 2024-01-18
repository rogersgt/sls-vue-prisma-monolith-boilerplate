<template>
  <v-container>
    <h1>{{  }}</h1>
  </v-container>
</template>

<script lang="ts">
import useBandStore from '@/stores/band.store';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'BandView',
  setup() {
    const route = useRoute();
    const bandId = route.params.bandId as string;

    const bandStore = useBandStore();
    const band$ = computed(() => bandStore.getBandById(bandId));

    onMounted(async () => {
      try {
        await bandStore.fetchBand(bandId);
      } catch (error) {
        console.error(error);
        // TODO: error toast
      }
    })
    return {
      band$,
      bandId
    }
  }
})
</script>
