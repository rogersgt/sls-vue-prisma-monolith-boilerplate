<template>
  <v-sheet :min-height="600" :elevation="22" class="d-flex justify-center text-center bg-grey w-100">
    <v-container>
      <h1 class="text-white">{{ band$?.name }}</h1>
      <v-tabs v-model="tab">
        <v-tab :class="{ 'mx-auto': $vuetify.display.mdAndDown }" value="bio">About</v-tab>
        <v-tab :class="{ 'mx-auto': $vuetify.display.mdAndDown }" value="schedule">Schedule</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="bg-white rounded pa-6">
        <v-window-item value="bio">
          <div class="d-flex p-24 my-2 ga-6 w-100 justify-center">
            <band-links v-if="band$" :band="band$"></band-links>
          </div>

          <v-expansion-panels
            class="my-2"
          >
            <v-expansion-panel>
              <v-expansion-panel-title>
                <h2>Music</h2>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="d-block p-0 my-2">
                  <v-text-field id="spotifyArtistId" placeholder="Spotify Artist ID" v-if="editMode" v-model="bandSpotifyArtistId"></v-text-field>
                  <label for="spotifyArtistId">Can be found at the end of the url copied from the artist page under "Share"</label>
                  <!-- FIXME: hide edit button if no permissions -->
                </div>
                  <v-btn color="primary" v-if="editMode">Save</v-btn>
                  <v-btn @click="editMode = !editMode" color="gray" v-if="editMode">Cancel</v-btn>
                  <v-btn v-if="!editMode" @click="editMode = !editMode" color="secondary">Edit</v-btn>
                <iframe v-if="band$?.spotifyArtistId" :src="`https://open.spotify.com/embed/artist/${band$.spotifyArtistId}?utm_source=generator`" width="100%" height="352" frameBorder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels
            class="my-2"
          >
            <v-expansion-panel>
              <v-expansion-panel-title>
                <h2>Social</h2>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <!-- TODO: Put IG Stuf here -->
                coming soon (IG stuff)
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-window-item>

        <v-window-item value="schedule">
          <h2>Shows</h2>
          <band-calendar :band="band$" v-if="band$"></band-calendar>
        </v-window-item>
      </v-window>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import useBandStore from '@/stores/band.store';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { computed } from 'vue';
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import BandLinks from '@/components/band/BandLinks.vue';
import BandCalendar from '@/components/band/BandCalendar.vue';
import type { Band } from '@/types/core';
import { watch } from 'vue';

export default defineComponent({
  name: 'BandView',
  components: {
    BandLinks,
    BandCalendar
  },
  setup() {
    const route = useRoute();
    const bandId = route.params.bandId as string;

    const bandStore = useBandStore();
    const band$ = computed(() => bandStore.getBandById(bandId));
    
    const bandSpotifyArtistId = ref<string>(band$.value?.spotifyArtistId ?? '');
    watch(() => band$.value, (newBandValue) => {
      if (newBandValue?.spotifyArtistId) {
        bandSpotifyArtistId.value = newBandValue.spotifyArtistId
      }
    })

    const tab = ref<'bio' | 'schedule'>('schedule');

    const editMode = ref<boolean>(false);
 
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
      editMode,
      bandSpotifyArtistId,
      bandId,
      tab
    }
  }
})
</script>
