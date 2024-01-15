<template>
  <v-dialog
    activator="parent"
    transition="dialog-bottom-transition"
    :width="500"
    ref="dialog"
    v-model="openDialog"
  >
    <v-sheet class="bg-grey-darken-4">
      <v-form @submit="save">
        <!-- name -->
        <v-text-field :rules="bandNameValidation" placeholder="Band Name" v-model="bandName"></v-text-field>
        <!-- state/province -->
        <v-autocomplete
          v-model="bandState"
          :items="stateOptions"
          label="Select State"
          item-title="name"
          item-value="id"
          return-object
          single-line
        ></v-autocomplete>
        <!-- city -->
        <v-autocomplete
          v-model="bandCity"
          :rules="bandCityValidation"
          :items="cityOptions"
          label="Search City"
          item-title="name"
          item-value="id"
          return-object
          single-line
          @update:search="searchCities"
          :disabled="!bandState"
        ></v-autocomplete>
        <!-- genres -->
        <v-autocomplete
          v-model="bandGenres"
          :items="genreOptions"
          label="Select Genres"
          item-title="name"
          item-value="id"
          chips
          multiple
          return-object
        ></v-autocomplete>

        <v-btn :disabled="!bandName.length || !bandCity?.id" type="submit" block class="bg-secondary text-white">Add</v-btn>
      </v-form>
    </v-sheet>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Province, City, Genre, Band } from '@/types/core';
import { onMounted } from 'vue';
import useLocationStore from '@/stores/location.store';
import useBandStore from '@/stores/band.store';
import useGenreStore from '@/stores/genre.store';
import { stringMinChars, valueRequired } from '@/validation';
import { watch } from 'vue';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'CreateBandDialog',
  setup() {
    const openDialog = ref<boolean>(false);

    const locationStore = useLocationStore();
    const bandStore = useBandStore();
    const genreStore = useGenreStore();
    const { allGenres$ } = storeToRefs(genreStore);

    const stateOptions = ref<Province[]>([]);
    const cityOptions = ref<City[]>([]);
    const genreOptions = ref<Genre[]>([]);

    const bandName = ref('');
    const bandCity = ref<City>();
    const bandState = ref<Province>();
    const bandGenres = ref<Genre[]>([]);

    onMounted(async () => {
      try {
        const [states] = await Promise.all([locationStore.fetchStates(), genreStore.fetchGenres()]);
        stateOptions.value = states;
      } catch (error) {
        console.error(error);
        // TODO: Show error toast
      }
    });

    const searchCitiesPid = ref<number>(0);
    const searchCities = (cityName: string) => {
      searchCitiesPid.value = setTimeout(async () => {
        if (searchCitiesPid.value) {
          clearTimeout(searchCitiesPid.value);
        }
        if (!cityName) {
          cityOptions.value = [];
          return;
        }
        try {
          cityOptions.value = await locationStore.searchCities(cityName, bandState.value ? bandState.value.id : undefined)
        } catch (error) {
          console.error(error);
          // TODO: show error toast
        }
        searchCitiesPid.value = 0;
      }, 500);
    };

    const save = async (e: Event) => {
      e.preventDefault();
      if (!bandCity.value || !bandName.value) return;
      try {
        console.log(bandGenres.value)
        await bandStore.createMyBand(new Band({
          name: bandName.value,
          cityId: bandCity.value.id,
          genres: bandGenres.value
        }));
        openDialog.value = false;
      } catch (error) {
        console.error(error);
        // TODO: error toast
      }
    };

    const bandNameValidation = [valueRequired];
    const bandCityValidation = [valueRequired, stringMinChars(4)];

    watch(() => bandState.value, (val, oldVal) => {
      if (val?.id !== oldVal?.id) {
        bandCity.value = undefined;
      }
    });

    watch(() => allGenres$.value, (genres) => {
      genreOptions.value = genres;
    });

    return {
      bandName,
      bandNameValidation,
      bandCityValidation,
      bandCity,
      bandGenres,
      bandState,
      cityOptions,
      genreOptions,
      openDialog,
      save,
      searchCities,
      stateOptions
    }
  }
})
</script>
