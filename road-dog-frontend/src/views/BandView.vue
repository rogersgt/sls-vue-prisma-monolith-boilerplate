<template>
  <v-sheet :min-height="600" :elevation="22" class="d-flex justify-center text-center bg-grey w-100">
    <v-container>
      <h1 class="text-white">{{ band$?.name }}</h1>
      <v-tabs v-model="tab">
        <v-tab :class="{ 'mx-auto': $vuetify.display.mdAndDown }" value="info">Info</v-tab>
        <v-tab :class="{ 'mx-auto': $vuetify.display.mdAndDown }" value="schedule">Schedule</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="info">
          <h3>Info</h3>
          <v-expansion-panels v-if="band$?.spotifyArtistId">
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
            v-if="band$?.instagramHandle"
          >
            <v-expansion-panel>
              <v-expansion-panel-title>
                <h2>Social</h2>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <!-- TODO: Put IG Stuf here -->
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-window-item>

        <v-window-item value="schedule">
          SCHEDULE
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

export default defineComponent({
  name: 'BandView',
  setup() {
    const route = useRoute();
    const bandId = route.params.bandId as string;

    const bandStore = useBandStore();
    const band$ = computed(() => bandStore.getBandById(bandId));

    const tab = ref<'info' | 'schedule'>('schedule');
 
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
