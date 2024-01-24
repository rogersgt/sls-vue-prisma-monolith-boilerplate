import { Band, BandShow, type Show } from '@/types/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as showService from '@/services/show.service';
import { addYears, subYears } from 'date-fns';
import useBandStore from './band.store';

const useShowStore = defineStore('ShowStore', () => {
  const showCache = ref<{
    [id: string]: Show
  }>({});

  const bandStore = useBandStore();

  const receiveShows = (shows: Show[]) => {
    const newShows = shows.reduce((prev, curr) => {
      const existingCache = showCache.value[curr.id];
      const bandsPlaying = (existingCache?.bandsPlaying ?? []).concat(curr.bandsPlaying).reduce((prev, curr) => {
        const prevBandShowIdx = prev.findIndex(({ bandId }) => curr.bandId === bandId);
        if (prevBandShowIdx >= 0) {
          const prevBandShow = prev[prevBandShowIdx];
          if (curr.band) {
            const band = new Band({
              ...prevBandShow.band,
              ...curr.band
            });
            bandStore.receiveBands([band]);
          }
          return prev.splice(prevBandShowIdx, 1, new BandShow({
            ...prevBandShow,
            ...curr
          }))
        }
        if (curr.band) {
          bandStore.receiveBands([curr.band]);
        }
        return prev.concat([curr]);
      }, [] as BandShow[]);
      return {
        ...prev,
        [curr.id]: {
          ...existingCache,
          ...curr,
          bandsPlaying
        }
      }
    }, {} as { [id: string]: Show});

    showCache.value = {
      ...showCache.value,
      ...newShows
    };
    console.log(showCache.value)
  };

  const getShowById = (id: string) => showCache.value[id];

  const createShow = async (show: Show) => {
    const createdShow = await showService.createShow(show);
    receiveShows([createdShow]);
  };

  const fetchShowsForBand = async (bandId: string) => {
    const startDate = subYears(new Date(), 1);
    const endDate = addYears(new Date(), 1);
    const shows = await showService.searchShowsForBand(bandId, startDate, endDate);
    receiveShows(shows);
  };

  const selectShowsForBand = (bandId: string) => {
    const storeShows = Object.keys(showCache.value).map((id) => showCache.value[id]);
    return storeShows.filter((show) => !!show.bandsPlaying.find((bandShow) => bandShow.bandId === bandId));
  };

  return {
    createShow,
    getShowById,
    receiveShows,
    selectShowsForBand,
    showCache,
    fetchShowsForBand
  };
});

export default useShowStore;
