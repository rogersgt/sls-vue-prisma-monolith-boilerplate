<template>
  <v-card class="band-card">
    <v-card-title>{{ band$?.name }}</v-card-title>
    <v-card-subtitle>
      <v-chip-group
          mandatory
          selected-class="text-primary"
        >
          <v-chip
            v-for="genre in band$?.genres"
            :key="genre.id"
          >
            {{ genre.name }}
          </v-chip>
        </v-chip-group>
    </v-card-subtitle>
    <v-card-text>
      <p v-if="founded$">Started in {{ founded$ }}</p>
      <a class="d-flex" target="_blank" v-if="band$?.instagramHandle" :href="`https://www.instagram.com/${band$.instagramHandle}`">
        <img class="imgLink mt-auto mb-auto rounded-circle" src="@/assets/ig_icon.svg" alt="Instagram link">
        <span class="mt-auto mb-auto">{{ band$.instagramHandle }}</span>
      </a>
      <a class="d-flex" target="_blank" v-if="band$?.spotifyArtistId" :href="`https://open.spotify.com/artist/${band$.spotifyArtistId}`">
        <img class="imgLink mt-auto mb-auto rounded-circle" src="@/assets/spotify_icon.svg" alt="Spotify link">
        <span class="mt-auto mb-auto">Spotify</span>
      </a>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import useBandStore from '@/stores/band.store';
import { computed } from 'vue';
import { defineComponent } from 'vue';
import { format } from 'date-fns';

export default defineComponent({
  name: 'BandCard',
  props: ['bandId'],
  setup({ bandId }) {
    const bandStore = useBandStore();
    const band$ = computed(() => bandStore.getBandById(bandId));

    const founded$ = computed(() => band$.value?.founded ? format(band$.value.founded, 'yyy') : undefined);

    return {
      band$,
      founded$,
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