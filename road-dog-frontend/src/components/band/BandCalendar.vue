<template>
  <v-calendar
    :dates="dates"
    borderless
    transparent
    expanded
    v-on:dayclick="handleDayClick"
    show-adjacent-months
  ></v-calendar>
</template>

<script lang="ts">

import type { Band } from '@/types/core';
import type { PropType } from 'vue';
import { ref } from 'vue';
import { defineComponent } from 'vue';
import type { CalendarDay } from '@/types/calendar';

export default defineComponent({
  name: 'BandCalendar',
  props: {
    band: Object as PropType<Band>
  },
  setup({ band }) {
    const dates = ref<Date[]>([]);

    const handleDayClick = (day: CalendarDay, e: MouseEvent) => {
      e.preventDefault();
      console.log(day);
      dates.value.push(day.date)
    }

    return {
      dates,
      handleDayClick,
    }
  },
})
</script>