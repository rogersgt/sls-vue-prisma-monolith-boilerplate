import type { Show } from '@/types/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as showService from '@/services/show.service';

const useShowStore = defineStore('ShowStore', () => {
  const showCache = ref<{
    [id: string]: Show
  }>({});

  const receiveShows = (shows: Show[]) => {
    const newShows = shows.reduce((prev, curr) => {
      const existingCache = showCache.value[curr.id];
      return {
        ...prev,
        [curr.id]: {
          ...existingCache,
          ...curr
        }
      }
    }, {} as { [id: string]: Show});

    showCache.value = {
      ...showCache.value,
      ...newShows
    };
  };

  const getShowById = (id: string) => showCache.value[id];

  const createShow = async (show: Show) => {
    const createdShow = await showService.createShow(show);
    receiveShows([createdShow]);
  }

  return {
    createShow,
    getShowById,
    receiveShows,
    showCache
  };
});

export default useShowStore;
