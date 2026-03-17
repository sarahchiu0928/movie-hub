// 取得電影類型
import { useQuery } from '@tanstack/vue-query'
import { axiosInstance } from '../utils/axiosInstance'
import type { GenreResponse } from '../types/movies'

export const movieGenresQueryKey = ['/genre/movie/list']

export const movieGenresQueryFn = async (): Promise<GenreResponse> => {
  const res = await axiosInstance.get('/genre/movie/list', {
    params: { language: 'zh-TW' }
  })
  return res.data
}

export const useGetMovieGenres = () => {
  return useQuery({
    queryKey: movieGenresQueryKey,
    queryFn: movieGenresQueryFn
  })
}