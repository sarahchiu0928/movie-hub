import axios from "axios"

const API_KEY = "f541ad63e070d2572bc8ed16541a8530"
const IMAGE_BASE = "https://image.tmdb.org/t/p"

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
})

export interface Movie {
  id: number
  title: string
  rating: number
  year: string
  duration: string
  genre: string
  backdrop: string
  poster: string
  description: string
}

export const getTrendingMovies = async (): Promise<Movie[]> => {
  const res = await api.get("/trending/movie/week", {
    params: {
      api_key: API_KEY,
      language: "zh-TW"
    }
  })
  return res.data.results.map((m: any): Movie => ({
    id: m.id,
    title: m.title,
    rating: Math.round(m.vote_average * 10) / 10,
    year: m.release_date?.slice(0, 4) ?? "",
    duration: "",
    genre: "",
    backdrop: m.backdrop_path ? `${IMAGE_BASE}/w1280${m.backdrop_path}` : "",
    poster: m.poster_path ? `${IMAGE_BASE}/w500${m.poster_path}` : "",
    description: m.overview,
  }))
}
