<template>
  <v-dialog
    activator="parent"
    transition="dialog-bottom-transition"
    :width="500"
  >
    <v-sheet class="bg-grey">
      <v-form @submit="save">
        <v-text-field placeholder="Band Name" v-model="bandName"></v-text-field>

        <v-btn type="submit" block class="bg-secondary text-white">Add</v-btn>
      </v-form>
    </v-sheet>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CreateBandDialog',
  setup() {
    const openDialog = ref<boolean>(false);
    const save = async (e: Event) => {
      e.preventDefault();
    };

    const bandName = ref('');

    return {
      bandName,
      openDialog,
      save
    }
  }
})
</script>
