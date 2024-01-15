<template>
  <v-dialog
    activator="parent"
    transition="dialog-bottom-transition"
    :width="500"
  >
    <v-sheet class="bg-grey">
      <v-form @submit="save">
        <v-text-field placeholder="Band Name" v-model="bandName"></v-text-field>
        <v-autocomplete
          v-model="bandState"
          :items="stateOptions"
          label="State/Provice"
          item-title="name"
          item-value="id"
          return-object
          single-line
        ></v-autocomplete>
        <v-autocomplete
          v-model="bandCity"
          :items="cityOptions"
          label="City"
          item-title="name"
          item-value="id"
          return-object
          single-line
          @update:search="searchCities"
        ></v-autocomplete>

        <v-btn type="submit" block class="bg-secondary text-white">Add</v-btn>
      </v-form>
    </v-sheet>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Province, City } from '@/types/core';
import { onMounted } from 'vue';
import useLocationStore from '@/stores/location.store';

export default defineComponent({
  name: 'CreateBandDialog',
  setup() {
    const openDialog = ref<boolean>(false);
    const save = async (e: Event) => {
      e.preventDefault();
      console.log(bandName.value, bandCity.value, bandState.value)
    };

    const locationStore = useLocationStore();
    const stateOptions = ref<Province[]>([]);
    const cityOptions = ref<City[]>([]);

    const bandName = ref('');
    const bandCity = ref<City>();
    const bandState = ref<Province>();

    onMounted(async () => {
      try {
        const states = await locationStore.fetchStates();
        stateOptions.value = states;
      } catch (error) {
        console.error(error);
        // TODO: Show error toast
      }
    });

    const searchCities = async (cityName: string) => {
      console.log('sdfasd')
      if (!cityName) {
        cityOptions.value = [];
        return;
      }
      try {
        console.log('SEARCHING CITIES')
        cityOptions.value = await locationStore.searchCities(cityName, bandState.value ? bandState.value.id : undefined)
      } catch (error) {
        console.error(error);
        // TODO: show error toast
      }
    };

    return {
      bandName,
      bandState,
      bandCity,
      cityOptions,
      openDialog,
      save,
      searchCities,
      stateOptions
    }
  }
})
</script>
