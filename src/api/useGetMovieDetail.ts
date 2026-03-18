// 取得電影詳細資訊
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { axiosInstance } from '../utils/axiosInstance'
import type { TmdbMovie } from '../types/movies'

export const movieDetailQueryKey = (id: string | number) => ['/movie', String(id)]

export const movieDetailQueryFn = async (id: string): Promise<TmdbMovie> => {
  const res = await axiosInstance.get<TmdbMovie>(`/movie/${id}`, {
    params: { language: 'zh-TW' },
  })
  return res.data
}

export const useGetMovieDetail = (
  id: Ref<string>,
  options?: Omit<UseQueryOptions<TmdbMovie>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TmdbMovie>({
    queryKey: computed(() => movieDetailQueryKey(id.value)),
    queryFn: () => movieDetailQueryFn(id.value),
    enabled: computed(() => !!id.value),
    ...options,
  })
}
