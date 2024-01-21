<template>
  <a class="d-flex mt-1 mb-1 text-info" target="_blank" v-if="band?.instagramHandle" :href="`https://www.instagram.com/${band.instagramHandle}`">
    <img class="imgLink mt-auto mb-auto rounded-circle" src="@/assets/ig_icon.svg" alt="Instagram link">
    <span class="mt-auto mb-auto">{{ band.instagramHandle }}</span>
    <font-awesome-icon class="mt-auto mb-auto ml-1" icon="fa-arrow-up-right-from-square"></font-awesome-icon>
  </a>
  <a class="d-flex mt-1 mb-1 text-info" target="_blank" v-if="band?.spotifyArtistId" :href="`https://open.spotify.com/artist/${band.spotifyArtistId}`">
    <img class="imgLink mt-auto mb-auto rounded-circle" src="@/assets/spotify_icon.svg" alt="Spotify link">
    <span class="mt-auto mb-auto">Spotify</span>
    <font-awesome-icon class="mt-auto mb-auto ml-1" icon="fa-arrow-up-right-from-square"></font-awesome-icon>
  </a>
  <a class="d-flex mt-1 mb-1 text-info" target="_blank" v-if="band?.websiteUrl" :href="band.websiteUrl">
    <img class="imgLink mt-auto mb-auto rounded-circle" src="@/assets/website.svg" alt="Website URL">
    <span class="mt-auto mb-auto">Website</span>
    <font-awesome-icon class="mt-auto mb-auto ml-1" icon="fa-arrow-up-right-from-square"></font-awesome-icon>
  </a>
</template>

<script lang="ts">
import type { Band } from '@/types/core';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BankLinks',
  props: {
    band: Object as PropType<Band>
  }
})
</script>

<style lang="scss">
.imgLink {
  width: 30px;
  margin-right: 5px;
}
</style>