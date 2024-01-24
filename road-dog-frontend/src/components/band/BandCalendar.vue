<template>
  <v-calendar
    :dates="dates"
    borderless
    transparent
    expanded
    v-on:dayclick="handleDayClick"
    show-adjacent-months
    :attributes="[{ highlight: true }]"
  >
  </v-calendar>
  <v-dialog
    width="auto"
    v-model="showDialog"
  >
    <v-sheet class="bg-white text-center">
      <v-container>
        <h1>{{ formattedDate$ }}</h1>
        <v-form @submit="scheduleShow">
        <div class="d-flex ga-2">
          <v-btn color="grey">Cancel</v-btn>
          <v-btn color="primary" type="submit">Schedule Show</v-btn>
          <p v-if="errorMessage" class="text-error">{{ errorMessage }}</p>
        </div>
      </v-form>
      </v-container>
    </v-sheet>
  </v-dialog>
</template>

<script lang="ts">

import { Band, Show, BandShow } from '@/types/core';
import type { PropType } from 'vue';
import { ref } from 'vue';
import { defineComponent } from 'vue';
import type { CalendarDay } from '@/types/calendar';
import { computed } from 'vue';
import useBandStore from '@/stores/band.store';
import { format } from 'date-fns';
import useShowStore from '@/stores/show.store';

export default defineComponent({
  name: 'BandCalendar',
  props: {
    band: Object as PropType<Band>
  },
  components: {},
  setup({ band }) {
    const dates = ref<Date[]>([]);
    const showStore = useShowStore();

    const showDialog = ref<boolean>(false);
    const activeCalendarDay = ref<CalendarDay | null>(null);
    const errorMessage = ref<string>('');

    const bandStore = useBandStore();
    const band$ = computed(() => bandStore.getBandById(band?.id ?? ''));

    const handleDayClick = (day: CalendarDay, e: MouseEvent) => {
      e.preventDefault();
      console.log(day);
      activeCalendarDay.value = day;
      showDialog.value = true;
    };

    const formatDate = (date: Date) => format(date, 'YYY-MM-dd');
    const formattedDate$ = computed(() => activeCalendarDay.value ? formatDate(activeCalendarDay.value.date) : undefined);

    const scheduleShow = async (e: Event) => {
      e.preventDefault();
      errorMessage.value = '';
      try {
        await showStore.createShow(new Show({
        date: activeCalendarDay.value?.date,
        bandsPlaying: [
          new BandShow({
            bandId: band$.value?.id ?? ''
          })
        ]
      }));
      showDialog.value = false;
      activeCalendarDay.value = null;
      } catch (error) {
        console.error(error);
        // TODO: show error toast
        errorMessage.value = 'There was an error saving show'
      }
    };

    return {
      activeCalendarDay,
      band$,
      dates,
      errorMessage,
      formatDate,
      formattedDate$,
      handleDayClick,
      showDialog,
      scheduleShow,
    }
  },
})
</script>