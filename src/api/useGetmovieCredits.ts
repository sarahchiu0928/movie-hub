import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { axiosInstance } from '../utils/axiosInstance'
import type { TmdbCredits } from '../types/movies'

export const movieCreditsQueryKey = (id: string | number) => ['/movie', String(id), 'credits']

export const movieCreditsQueryFn = async (id: string): Promise<TmdbCredits> => {
  const res = await axiosInstance.get<TmdbCredits>(`/movie/${id}/credits`, {
    params: { language: 'zh-TW' },
  })

  return res.data
}

export const useGetMovieCredits = (
  id: Ref<string>,
  options?: Omit<UseQueryOptions<TmdbCredits>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TmdbCredits>({
    queryKey: computed(() => movieCreditsQueryKey(id.value)),
    queryFn: () => movieCreditsQueryFn(id.value),
    enabled: computed(() => !!id.value),
    ...options,
  })
}
