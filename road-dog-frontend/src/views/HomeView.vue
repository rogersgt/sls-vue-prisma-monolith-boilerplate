<script lang="ts">
import useBandStore from '@/stores/band.store';
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import CreateBandDialog from '@/components/band/CreateBandDialog.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    CreateBandDialog
  },
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

    <div v-if="!bands.length" class="d-block mt-16">
      <h3 class="my-2">You do not belong to any bands</h3>
      <v-btn class="bg-primary text-white pa-2 my-2" variant="elevated">
        <font-awesome-icon icon="fa-plus"></font-awesome-icon>
        Add your band
        <CreateBandDialog />
      </v-btn>
    </div>
  </v-sheet>
</template>

<style scoped lang="scss">
</style>