// 搜尋電影
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { axiosInstance } from '../utils/axiosInstance'
import type { TmdbMovie } from '../types/movies'
import type { PageResponseGenerics } from '../types/responseGenerics'

// 將 TMDB 分頁回應泛型套用至電影型別，作為搜尋 API 的回傳型別
type SearchMoviesResponse = PageResponseGenerics<TmdbMovie>

/**
 * 產生搜尋電影的 Query Key。
 * Vue Query 使用此 key 作為快取的唯一識別，當 query 改變時會自動重新請求。
 *
 * @param query - 使用者輸入的搜尋關鍵字
 * @returns 由路徑與關鍵字組成的陣列，用於區分不同搜尋的快取
 */
export const searchMoviesQueryKey = (query: string) => ['/search/movie', query]

/**
 * 呼叫 TMDB 搜尋電影 API 的純函式（非 composable）。
 * 可單獨用於預取（prefetch）或 SSR 情境，不依賴 Vue 響應式系統。
 *
 * @param query - 搜尋關鍵字
 * @returns 符合關鍵字的電影分頁資料
 */
export const searchMoviesQueryFn = async (query: string): Promise<SearchMoviesResponse> => {
  const res = await axiosInstance.get<SearchMoviesResponse>('/search/movie', {
    params: { query, language: 'zh-TW' },
  })
  return res.data
}

/**
 * 搜尋電影的 Vue Query composable。
 * 封裝了 queryKey、queryFn 與啟用條件，讓元件只需傳入響應式搜尋文字即可使用。
 *
 * @param searchText - 響應式的搜尋關鍵字（Ref<string>），由元件傳入
 * @param options - 可選的額外 Vue Query 設定，會覆蓋預設值（已排除 queryKey 與 queryFn）
 * @returns useQuery 的回傳值，包含 data、isLoading、isError 等狀態
 */
export const useSearchMovies = (
  searchText: Ref<string>,
  options?: Omit<UseQueryOptions<SearchMoviesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SearchMoviesResponse>({
    // computed 確保 searchText 變動時，queryKey 自動更新並觸發新的請求
    queryKey: computed(() => searchMoviesQueryKey(searchText.value)),
    queryFn: () => searchMoviesQueryFn(searchText.value),
    // 避免在搜尋欄為空或只有空白時發出無效請求
    enabled: computed(() => searchText.value.trim().length > 0),
    // 展開外部傳入的選項，允許元件層自訂快取時間、重試次數等行為
    ...options,
  })
}
