import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { axiosInstance } from '../utils/axiosInstance'
import type { TmdbMovie } from '../types/movies'
import type { PageResponseGenerics } from '../types/responseGenerics'

type TrendingMoviesResponse = PageResponseGenerics<TmdbMovie>

const trendingMoviesQueryKey = ['/trending', 'movie', 'week']

const trendingMoviesQueryFn = async () => {
  const res = await axiosInstance.get<TrendingMoviesResponse>('/trending/movie/week', {
    params: { language: 'zh-TW' }
  })
  return res.data
}

export const useGetTrendingMovies = (options?: Omit<UseQueryOptions<TrendingMoviesResponse>, 'queryKey' | 'queryFn'>) => {
  return useQuery<TrendingMoviesResponse>({
    queryKey: trendingMoviesQueryKey,
    queryFn: trendingMoviesQueryFn,
    ...options,
  })
}
