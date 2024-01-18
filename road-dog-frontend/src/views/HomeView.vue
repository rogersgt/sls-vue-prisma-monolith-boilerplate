<script lang="ts">
import useBandStore from '@/stores/band.store';
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import CreateBandDialog from '@/components/band/CreateBandDialog.vue';
import BandCard from '@/components/band/BandCard.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import useUserStore from '@/stores/user.store';

export default defineComponent({
  name: 'HomeView',
  components: {
    BandCard,
    CreateBandDialog
  },
  setup() {
    const userStore = useUserStore();
    const { loggedInUser$ } = storeToRefs(userStore);
    const isLoading = ref<boolean>(false);
    const bandStore = useBandStore();
    const { loggedInUserBands$ } = storeToRefs(bandStore);

    onMounted(async () => {
      try {
        isLoading.value = true;
        await bandStore.fetchBandsForLoggedInUser();
        isLoading.value = false;
      } catch (error) {
        console.error(error);
        // TODO: show error toast
        isLoading.value = false;
      }
    })

    return {
      bands: loggedInUserBands$,
      isLoading,
      loggedInUser$
    }
  }
})
</script>

<template>
  <v-sheet :min-height="600" :elevation="22" class="d-flex justify-center text-center bg-grey w-100">
    <v-container>
      <div class="d-flex mx-0 my-3 p-0 w-100 justify-center">
        <v-btn color="primary" v-if="!isLoading">
          <font-awesome-icon icon="fa-plus"></font-awesome-icon>
          Add band
          <CreateBandDialog />
        </v-btn>
      </div>

      <div v-if="!isLoading" class="w-100 m-0 p-0">
        <band-card :class="{
          'w-50 mx-auto mt-2': true,
          'w-100': $vuetify.display.mdAndDown
          // FIXME: use roles and permissions here
        }" v-for="band in bands" :key="band.id" :band-id="band.id" :show-delete-option="true"></band-card>

        <v-skeleton-loader
          :class="{
            'w-50 mx-auto mt-2': true,
            'w-100': $vuetify.display.mdAndDown
          }"
          type="card"
          loading
          v-if="isLoading"
        ></v-skeleton-loader>
      </div>

      <div v-if="!bands.length && !isLoading" class="d-block mt-16">
        <h3 class="my-2">You do not belong to any bands</h3>
        <v-btn class="bg-primary text-white pa-2 my-2" variant="elevated">
          <font-awesome-icon icon="fa-plus"></font-awesome-icon>
          Add your band
          <CreateBandDialog />
        </v-btn>
      </div>
    </v-container>
  </v-sheet>
</template>

<style scoped lang="scss">
</style>