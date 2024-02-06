<template>
  <v-dialog
    activator="parent"
    transition="dialog-bottom-transition"
    :width="500"
    :height="500"
    ref="dialog"
    v-model="openDialog"
  >
    <v-sheet class="bg-grey-darken-4">
      <h1 class="p-1 w-100 m-0 text-center">Add Band</h1>

      <v-form @submit="save">
        <!-- name -->
        <label for="bandName" class="ml-4">Name</label>
        <v-text-field id="bandName" :rules="bandNameValidation" placeholder="Band Name" v-model="bandName"></v-text-field>
        <!-- state/province -->
        <label class="ml-4" for="bandState">State/Province</label>
        <v-autocomplete
          id="bandState"
          v-model="bandState"
          :items="stateOptions"
          label="Select State"
          item-title="name"
          item-value="id"
          return-object
          single-line
        ></v-autocomplete>
        <!-- city -->
        <label for="bandCity" class="ml-4">{{ !bandState?.id ? 'Select state first' : 'City' }}</label>
        <v-autocomplete
          id="bandCity"
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
        <label class="ml-4" for="bandGenres">Genres <span class="text-grey-lighten-1">(optional)</span></label>
        <v-autocomplete
          id="bandGenres"
          v-model="bandGenres"
          :items="genreOptions"
          label="Select Genres"
          item-title="name"
          item-value="id"
          chips
          multiple
          return-object
        ></v-autocomplete>
        <!-- IG -->
        <label class="ml-4" for="bandIGHandle">Instagram <span class="text-grey-lighten-1">(optional)</span></label>
        <v-text-field
          id="bandIGHandle"
          placeholder="Instagram Handle"
          v-model="bandIGHandle"
          :rules="bandIGHandleValidation"
        ></v-text-field>
        <!-- spotify -->
        <label class="ml-4" for="bandSpotify">Spotify <span class="text-grey-lighten-1">(optional)</span></label>
        <v-text-field
          id="bandSpotify"
          placeholder="Spotify Artist ID"
          v-model="bandSpotifyArtistId"
          :rules="bandSpotifyArtistIdValidation"
        ></v-text-field>
        <!-- website -->
        <label class="ml-4" for="bandWebsite">Website <span class="text-grey-lighten-1">(optional)</span></label>
        <v-text-field
          id="bandWebsite"
          placeholder="Website URL"
          v-model="bandWebsiteUrl"
          :rules="bandWebsiteUrlValidation"
        ></v-text-field>

        <p v-if="errorMessage" class="text-white bg-error p-4 text-center w-100 mx-0 my-1">{{ errorMessage }}</p>
        <v-btn type="submit" block class="bg-secondary text-white">Add</v-btn>
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
import { stringMinChars, valueRequired, mustBeValidUrl, mustNotBeUrl } from '@/validation';
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
    const bandIGHandle = ref<string>();
    const bandSpotifyArtistId = ref<string>();
    const bandWebsiteUrl = ref<string>();
    // const bandFoundedDate = ref<Date>();

    const errorMessage = ref<string>();

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
          errorMessage.value = 'There was an error searching cities';
        }
        searchCitiesPid.value = 0;
      }, 500);
    };

    watch(() => bandName.value, (name, oldName) => {
      if (name && name !== oldName) {
        errorMessage.value = '';
      }
    });

    watch(() => bandCity.value, (city, oldCity) => {
      if (city && city.id !== oldCity?.id) {
        errorMessage.value = '';
      }
    })

    const save = async (e: Event) => {
      e.preventDefault();
      if (!bandCity.value || !bandName.value) {
        errorMessage.value = 'Band name, state, and city are required';
        return;
      }

      try {
        await bandStore.createMyBand(new Band({
          name: bandName.value,
          cityId: bandCity.value.id,
          genres: bandGenres.value,
          websiteUrl: bandWebsiteUrl.value,
          spotifyArtistId: bandSpotifyArtistId.value,
          instagramHandle: bandIGHandle.value
        }));
        openDialog.value = false;
      } catch (error) {
        console.error(error);
        // TODO: error toast
      }
    };

    const bandNameValidation = [valueRequired];
    const bandCityValidation = [valueRequired, stringMinChars(4)];
    const bandWebsiteUrlValidation = [mustBeValidUrl];
    const bandSpotifyArtistIdValidation = [
      mustNotBeUrl,
      // async (value: string) => {
      //   try {
      //     await axios.get(`https://open.spotify.com/artist/${value}`);
      //     return true;
      //   } catch (error) {
      //     return false;
      //   }
      // }
    ];
    const bandIGHandleValidation = [
    mustNotBeUrl,
    // async (value: string) => {
    //   try {
    //     await axios.get(`https://www.instagram.com/${value}`);
    //     return true;
    //   } catch (error) {
    //     return false;
    //   }
    // }
  ];

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
      bandWebsiteUrlValidation,
      bandSpotifyArtistIdValidation,
      bandIGHandleValidation,
      bandCity,
      bandGenres,
      bandState,
      bandIGHandle,
      bandSpotifyArtistId,
      bandWebsiteUrl,
      errorMessage,
      // bandFoundedDate,
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
