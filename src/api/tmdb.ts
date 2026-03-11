import axios from "axios"

const API_KEY = "f541ad63e070d2572bc8ed16541a8530"
const IMAGE_BASE = "https://image.tmdb.org/t/p"

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
})

export interface Actor {
  name: string
  role: string
  img: string
}

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
  cast?: Actor[]
}

const mockCast = [
  { name: "提摩西夏勒梅", role: "飾 主角", img: "https://i.pravatar.cc/150?u=a1" },
  { name: "千黛亞", role: "飾 角色A", img: "https://i.pravatar.cc/150?u=a2" },
  { name: "奧斯汀巴特勒", role: "飾 角色B", img: "https://i.pravatar.cc/150?u=a3" }
]

export const getTrendingMovies = async (): Promise<Movie[]> => {
  const res = await api.get("/trending/movie/week", {
    params: {
      api_key: API_KEY,
      language: "zh-TW"
    }
  })
  return res.data.results.map((m: any): Movie => ({
    id: m.id,
    title: m.title || m.name,
    rating: Math.round(m.vote_average * 10) / 10,
    year: m.release_date?.slice(0, 4) || m.first_air_date?.slice(0, 4) || "2024",
    duration: "2h 15m",
    genre: "動作 / 科幻",
    backdrop: m.backdrop_path ? `${IMAGE_BASE}/w1280${m.backdrop_path}` : "",
    poster: m.poster_path ? `${IMAGE_BASE}/w500${m.poster_path}` : "",
    description: m.overview || "暫無簡介",
    cast: mockCast
  }))
}
