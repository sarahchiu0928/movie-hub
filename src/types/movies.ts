export interface TmdbMovie {
  id: number
  title: string
  name?: string
  vote_average: number
  release_date?: string
  first_air_date?: string
  backdrop_path: string | null
  poster_path: string | null
  overview: string
}

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

export interface TmdbVideo {
id: string
key: string
name: string
site: string
type: string
official: boolean
}

export interface MovieVideosResponse {
id: number
results: TmdbVideo[]
}

export interface TmdbCast {
id: number
name: string
character: string
profile_path: string | null
order: number
}

export interface TmdbCredits {
id: number
cast: TmdbCast[]
}