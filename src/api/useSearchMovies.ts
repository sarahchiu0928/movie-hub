import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { axiosInstance } from '../utils/axiosInstance'
import type { TmdbMovie } from '../types/movies'
import type { PageResponseGenerics } from '../types/responseGenerics'

type SearchMoviesResponse = PageResponseGenerics<TmdbMovie> // 搜尋結果的型別

export const searchMoviesQueryKey = (query: string) => ['/search/movie', query] // 搜尋結果的 key

export const searchMoviesQueryFn = async (query: string): Promise<SearchMoviesResponse> => {
  const res = await axiosInstance.get<SearchMoviesResponse>('/search/movie', {
    params: { query, language: 'zh-TW' }
  })
  return res.data
}

export const useSearchMovies = (
  query: Ref<string>,
  options?: Omit<UseQueryOptions<SearchMoviesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SearchMoviesResponse>({
    queryKey: computed(() => searchMoviesQueryKey(query.value)),
    queryFn: () => searchMoviesQueryFn(query.value),
    enabled: computed(() => query.value.trim().length > 0),
    ...options,
  })
}