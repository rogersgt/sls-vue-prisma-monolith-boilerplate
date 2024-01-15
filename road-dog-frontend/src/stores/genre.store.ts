import { Genre } from '@/types/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import * as genreService from '@/services/genre.service';

const useGenreStore = defineStore('GenreStore', () => {
  const genreCache = ref<{
    [id: string]: Genre
  }>({});

  const receiveGenres = (genres: Genre[]) => {
    const newGenres = genres.reduce((prev, curr) => {
      const existingCache = genreCache.value[curr.id];
      return {
        ...prev,
        [curr.id]: {
          ...existingCache,
          ...curr
        }
      }
    }, {} as { [id: string]: Genre});

    genreCache.value = {
      ...genreCache.value,
      ...newGenres
    };
  };

  const getGenreById = (id: string) => genreCache.value[id];

  const fetchGenres = async () => {
    const genres = await genreService.listGenres();
    receiveGenres(genres);
    return genres;
  };

  const allGenres$ = computed(() => Object.keys(genreCache.value).map((id) => {
    const genre = getGenreById(id);
    return new Genre({ ...genre });
  }));

  return {
    allGenres$,
    getGenreById,
    receiveGenres,
    fetchGenres
  };
});

export default useGenreStore;
