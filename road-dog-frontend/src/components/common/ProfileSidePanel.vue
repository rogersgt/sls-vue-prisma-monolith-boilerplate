<template>
  <div :class="{
    'bg-white pa-10 w-25 side-bar': true,
    'ml-0': sidePanelOpen
  }">
    <div class="d-flex w-100 justify-end">
      <v-btn class="x-btn" @click="toggleSidePanel()">
        <font-awesome-icon icon="fa-x"></font-awesome-icon>
      </v-btn>
    </div>
    <img v-if="!loggedInUser$?.pictureUrl" class="w-50 profile-image rounded-circle" src="@/assets/default-profile-image.webp" alt="No image">
    <img v-if="!!loggedInUser$?.pictureUrl" class="w-50 profile-image rounded-circle" :src="loggedInUser$.pictureUrl" :alt="loggedInUser$.firstName + ' ' + loggedInUser$.lastName">
    <h2>{{ loggedInUser$?.firstName }} {{ loggedInUser$?.lastName }}</h2>

    <p class="flex align-middle"><font-awesome-icon icon="fa-envelope"></font-awesome-icon> {{ loggedInUser$?.email }}</p>
    <p>Part of {{ loggedInUser$?.bandMemberships.length }} bands</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useNavStore from '@/stores/nav.store';
import { storeToRefs } from 'pinia';
import useUserStore from '@/stores/user.store';

export default defineComponent({
  name: 'ProfileSidePanel',
  setup() {
    const navStore = useNavStore();
    const { sidePanelOpen } = storeToRefs(navStore);

    const toggleSidePanel = () => navStore.toggleSidePanel();

    const userStore = useUserStore();
    const { loggedInUser$ } = storeToRefs(userStore);

    return {
      sidePanelOpen,
      toggleSidePanel,
      loggedInUser$
    }
  }
})
</script>

<style lang="scss">
.side-bar {
  position: fixed;
  transition: 0.5s;
  transition-property: margin-left;
  z-index: 20;
  height: 93vh;
  margin-top: 7vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  min-width: 300px;
  margin-left: -40%;
}

.profile-image {
  max-width: 150px;
  min-width: 75px;
}

.x-btn {
  border: none;
  outline: none;
  box-shadow: none;
}

@media (max-width: 750px) {
  .side-bar {
    margin-left: -50%;
  }
}

@media (max-width: 600px) {
  .side-bar {
    margin-left: -60%;
  }
}
</style>