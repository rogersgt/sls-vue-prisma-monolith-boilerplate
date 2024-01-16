<template>
  <v-card class="band-card">
    <v-card-title @click="goToBandView()" class="text-primary-darken-2 clickable">
      <h3>{{ band$?.name?.toLocaleUpperCase() }}</h3>
    </v-card-title>
    <v-card-subtitle>
      <div class="justify-center">
          <v-chip
            v-for="genre in band$?.genres"
            :key="genre.id"
            color="primary"
          >
            {{ genre.name }}
          </v-chip>
        </div>
    </v-card-subtitle>

    <v-divider inset class="my-2 mx-auto"></v-divider>

    <v-card-text>
      <p class="text-grey-darken-4" v-if="founded$">Started in {{ founded$ }}</p>
      
      <div :class="{
        'w-25': $vuetify.display.mdAndUp
      }">
        <a class="d-flex mt-1 mb-1 text-info" target="_blank" v-if="band$?.instagramHandle" :href="`https://www.instagram.com/${band$.instagramHandle}`">
          <img class="imgLink mt-auto mb-auto rounded-circle" src="@/assets/ig_icon.svg" alt="Instagram link">
          <span class="mt-auto mb-auto">{{ band$.instagramHandle }}</span>
          <font-awesome-icon class="mt-auto mb-auto ml-1" icon="fa-arrow-up-right-from-square"></font-awesome-icon>
        </a>
        <a class="d-flex mt-1 mb-1 text-info" target="_blank" v-if="band$?.spotifyArtistId" :href="`https://open.spotify.com/artist/${band$.spotifyArtistId}`">
          <img class="imgLink mt-auto mb-auto rounded-circle" src="@/assets/spotify_icon.svg" alt="Spotify link">
          <span class="mt-auto mb-auto">Spotify</span>
          <font-awesome-icon class="mt-auto mb-auto ml-1" icon="fa-arrow-up-right-from-square"></font-awesome-icon>
        </a>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import useBandStore from '@/stores/band.store';
import { computed } from 'vue';
import { defineComponent } from 'vue';
import { format } from 'date-fns';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'BandCard',
  props: ['bandId'],
  setup({ bandId }) {
    const bandStore = useBandStore();
    const band$ = computed(() => bandStore.getBandById(bandId));

    const router = useRouter();

    const founded$ = computed(() => band$.value?.founded ? format(band$.value.founded, 'yyy') : undefined);

    const goToBandView = () => {
      router.push({
        name: 'band',
        params: {
          bandId
        }
      })
    }

    return {
      band$,
      founded$,
      goToBandView
    }
  }
})
</script>

<style lang="scss" scoped>
.imgLink {
  width: 30px;
  margin-right: 5px;
}

.band-card {
  min-width: 400px;
}
</style>