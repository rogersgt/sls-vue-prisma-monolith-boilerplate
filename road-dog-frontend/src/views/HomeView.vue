<script lang="ts">
import useBandStore from '@/stores/band.store';
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const bandStore = useBandStore();
    const { loggedInUserBands$ } = storeToRefs(bandStore);

    return {
      bands: loggedInUserBands$
    }
  }
})
</script>

<template>
  <v-sheet :min-height="600" :elevation="22" class="d-flex justify-center text-center bg-grey w-100">
    <v-list class="d-block">
      <v-list-item v-for="band in bands" :key="band.id">
        <v-card >
          <h3>{{ band.name }}</h3>
        </v-card>
      </v-list-item>
    </v-list>

    <div v-if="!bands.length" class="d-block">
      <p >You do not belong to any bands</p>
      <v-btn class="bg-primary text-white pa-2" variant="elevated">
        <font-awesome-icon icon="fa-plus"></font-awesome-icon>
        Add your band
      </v-btn>
    </div>
  </v-sheet>
</template>

<style scoped lang="scss">
</style>