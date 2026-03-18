// 取得電影預告
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { axiosInstance } from '../utils/axiosInstance'
import type { TmdbVideo } from '../types/movies'
import type { PageResponseGenerics } from '../types/responseGenerics'

type MovieVideosResponse = PageResponseGenerics<TmdbVideo>

export const movieVideosQueryKey = (movieId: number) => ['/movie/videos', movieId]

export const movieVideosQueryFn = async (movieId: number): Promise<MovieVideosResponse> => {
  const res = await axiosInstance.get<MovieVideosResponse>(`/movie/${movieId}/videos`, {
    params: { language: 'zh-TW' },
  })
  return res.data
}

export const useGetMovieTrailer = (
  movieId: Ref<number>,
  options?: Omit<UseQueryOptions<MovieVideosResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<MovieVideosResponse>({
    queryKey: computed(() => movieVideosQueryKey(movieId.value)),
    queryFn: () => movieVideosQueryFn(movieId.value),
    enabled: computed(() => movieId.value > 0),
    ...options,
  })
}
