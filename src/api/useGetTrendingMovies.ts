// 取得熱門電影
import { useInfiniteQuery } from '@tanstack/vue-query'
import { axiosInstance } from '../utils/axiosInstance'
import type { TmdbMovie } from '../types/movies'
import type { PageResponseGenerics } from '../types/responseGenerics'

type TrendingMoviesResponse = PageResponseGenerics<TmdbMovie>

const trendingMoviesQueryKey = ['/trending', 'movie', 'week']

const trendingMoviesQueryFn = async ({ pageParam }: { pageParam: unknown }) => {
  const res = await axiosInstance.get<TrendingMoviesResponse>('/trending/movie/week', {
    params: { language: 'zh-TW', page: (pageParam as number) ?? 1 },
  })
  return res.data
}

export const useGetTrendingMovies = () => {
  return useInfiniteQuery<TrendingMoviesResponse>({
    queryKey: trendingMoviesQueryKey,
    queryFn: trendingMoviesQueryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1
      }
      return undefined
    },
  })
}
