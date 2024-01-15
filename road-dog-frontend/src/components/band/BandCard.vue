<template>
  <v-card class="band-card">
    <v-card-title>{{ band$?.name }}</v-card-title>
    <v-card-subtitle>{{ band$?.city.name }}</v-card-subtitle>
    <v-card-text>
      <p v-if="founded$">Started in {{ founded$ }}</p>
      <a class="d-flex" target="_blank" v-if="band$?.instagramHandle" :href="`https://www.instagram.com/${band$.instagramHandle}`">
        <img class="imgLink" src="@/assets/ig_icon.svg" alt="Instagram link">
        <span>{{ band$.instagramHandle }}</span>
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
}

.band-card {
  min-width: 400px;
}
</style>