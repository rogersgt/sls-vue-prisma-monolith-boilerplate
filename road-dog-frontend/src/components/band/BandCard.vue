<template>
  <v-card class="band-card">
    <v-card-title @click="goToBandView()" class="d-flex text-primary-darken-2 clickable justify-center ga-2">
      <h3>{{ band$?.name?.toLocaleUpperCase() }}</h3>
      <h6><font-awesome-icon icon="fa-arrow-up-right-from-square"></font-awesome-icon></h6>
    </v-card-title>
    <div class="w-100 m-0 p-0" v-if="showDeleteOption">
      <v-btn class="d-flex options-btn">
        <font-awesome-icon icon="fa-ellipsis-vertical"></font-awesome-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item>
              <v-btn color="error">
                Delete
                <v-dialog
                  v-model="deleteDialog"
                  activator="parent"
                  width="auto"
                >
                  <v-card>
                    <v-card-text>
                      Are you sure you want to delete {{ band$?.name }}?
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="secondary"  @click="deleteDialog = false">Cancel</v-btn>
                      <v-btn color="error" @click="deleteBand($event)">Delete</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>
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
import { ref } from 'vue';

export default defineComponent({
  name: 'BandCard',
  props: ['bandId', 'showDeleteOption'],
  setup({ bandId }) {
    const bandStore = useBandStore();
    const band$ = computed(() => bandStore.getBandById(bandId));

    const deleteDialog = ref<boolean>(false);

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

    const deleteBand = async (e: MouseEvent) => {
      e.preventDefault();
      try {
        await bandStore.deleteBand(bandId);
        deleteDialog.value = false;
      } catch (error) {
        console.error(error);
        // TODO: show error toast
      }
    };

    return {
      band$,
      deleteBand,
      deleteDialog,
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

.options-btn {
  box-shadow: none;
  margin-left: auto;
  margin-top: -40px;
}
</style>