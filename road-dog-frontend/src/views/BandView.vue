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
            v-if="band$?.spotifyArtistId"
          >
            <v-expansion-panel>
              <v-expansion-panel-title>
                <h2>Music</h2>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <iframe :src="`https://open.spotify.com/embed/artist/${band$.spotifyArtistId}?utm_source=generator`" width="100%" height="352" frameBorder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels
            class="my-2"
            v-if="band$?.instagramHandle"
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
          <v-date-picker
          class="w-100"
            hide-header
          ></v-date-picker>
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

export default defineComponent({
  name: 'BandView',
  components: {
    BandLinks
  },
  setup() {
    const route = useRoute();
    const bandId = route.params.bandId as string;

    const bandStore = useBandStore();
    const band$ = computed(() => bandStore.getBandById(bandId));

    const tab = ref<'bio' | 'schedule'>('schedule');
 
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
      bandId,
      tab
    }
  }
})
</script>
