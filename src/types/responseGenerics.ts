// 放response的泛型
export interface PageResponseGenerics<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}