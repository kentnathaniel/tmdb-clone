import * as actionTypes from './actionTypes'
import axios from 'axios'

const API_KEY = `79ff1b0d338aa1ba767e1c7c2f1240e6`
const YOUTUBE_API_KEY = 'AIzaSyDksmyH45dBYt4Pc-GVuqPaArizgZtndgw'
const BASE_URL = `https://api.themoviedb.org/3`
const TRENDING_DAY_URL = `${BASE_URL}/trending/all/day`
const TRENDING_WEEK_URL = `${BASE_URL}/trending/all/week`
const POPULAR_MOVIE = `${BASE_URL}/movie/popular`
const POPULAR_TV = `${BASE_URL}/tv/popular`
const POPULAR_PEOPLE = `${BASE_URL}/person/popular`

const NOW_PLAYING_MOVIE = `${BASE_URL}/movie/now_playing`
const UPCOMING_MOVIE = `${BASE_URL}/movie/upcoming`
const TOP_RATED_MOVIE = `${BASE_URL}/movie/top_rated`

const AIRING_TODAY_TV = `${BASE_URL}/tv/airing_today`
const ON_THE_AIR_TV = `${BASE_URL}/tv/on_the_air`
const TOP_RATED_TV = `${BASE_URL}/tv/top_rated`

const YOUTUBE_URL = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&part=snippet&id=`

export const fetchDetailsSuccess = (data) => {
  return {
    type: actionTypes.FETCH_DETAILS,
    data
  }
}

export const fetchDetails = (id, genre) => {
  return async dispatch => {
    try {
      const DETAILS_URL = genre === 'tv' ?
        `${BASE_URL}/tv/${id}`
        : `${BASE_URL}/movie/${id}`

      const { data } = await axios.get(DETAILS_URL, {
        params: {
          api_key: API_KEY,
          append_to_response: 'credits,keywords,external_ids'
        }
      })

      dispatch(fetchDetailsSuccess(data))
    }
    catch {
      console.log('error')
    }
  }
}

export const fetchTrendingTodaySuccess = (data) => {
  return {
    type: actionTypes.FETCH_TRENDING_TODAY_SUCCESS,
    data
  }
}

export const fetchTrendingWeekSuccess = (data) => {
  return {
    type: actionTypes.FETCH_TRENDING_WEEK_SUCCESS,
    data
  }
}

export const fetchPopularMovieSuccess = (data) => {
  data.results = data.results.map(data => ({ ...data, media_type: 'movie' }))
  return {
    type: actionTypes.FETCH_POPULAR_MOVIES_SUCCESS,
    data
  }
}

export const fetchPopularTVSuccess = (data) => {
  data.results = data.results.map(data => ({ ...data, media_type: 'tv' }))
  return {
    type: actionTypes.FETCH_POPULAR_TV_SUCCESS,
    data
  }
}

export const fetchPopularPeopleSuccess = (data) => {
  data.results = data.results.map(data => ({ ...data, media_type: 'people' }))
  return {
    type: actionTypes.FETCH_POPULAR_PEOPLE_SUCCESS,
    data
  }
}

export const fetchTrailerTVSuccess = (data) => {
  data = data.map(data => ({ ...data, media_type: 'tv' }))
  return {
    type: actionTypes.FETCH_TRAILER_TV_SUCCESS,
    data
  }
}

export const fetchTrailerMoviesSuccess = (data) => {
  data = data.map(data => ({ ...data, media_type: 'movie' }))
  return {
    type: actionTypes.FETCH_TRAILER_MOVIES_SUCCESS,
    data
  }
}

export const fetchFilteredMoviesSuccess = (data, type) => {
  data.results = data.results.map(dat => ({...dat, media_type: type}))
  return {
    type: actionTypes.FETCH_FILTERED_MOVIE_SUCCESS,
    data
  }
}

export const fetchNowPlayingMoviesSuccess = (data) => {
  data.results = data.results.map(data => ({ ...data, media_type: 'movie' }))
  return {
    type: actionTypes.FETCH_NOW_PLAYING_MOVIES_SUCCESS,
    data
  }
}

export const fetchUpcomingMoviesSuccess = (data) => {
  data.results = data.results.map(data => ({ ...data, media_type: 'movie' }))
  return {
    type: actionTypes.FETCH_UPCOMING_MOVIES_SUCCESS,
    data
  }
}

export const fetchTopRatedMoviesSuccess = (data) => {
  data.results = data.results.map(data => ({ ...data, media_type: 'movie' }))
  return {
    type: actionTypes.FETCH_TOP_RATED_MOVIES_SUCCESS,
    data
  }
}

export const fetchAiringTodayTVSuccess = (data) => {
  data.results = data.results.map(data => ({ ...data, media_type: 'tv' }))
  return {
    type: actionTypes.FETCH_AIRING_TODAY_TV_SUCCESS,
    data
  }
}

export const fetchOnTheAirTVSuccess = (data) => {
  data.results = data.results.map(data => ({ ...data, media_type: 'tv' }))
  return {
    type: actionTypes.FETCH_ON_THE_AIR_TV_SUCCESS,
    data
  }
}

export const fetchTopRatedTVSuccess = (data) => {
  data.results = data.results.map(data => ({ ...data, media_type: 'tv' }))
  return {
    type: actionTypes.FETCH_TOP_RATED_TV_SUCCESS,
    data
  }
}

export const fetchFilteredMovies = (sort = '', genre, type) => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`${BASE_URL}/discover/${type}`, {
        params: {
          api_key: '79ff1b0d338aa1ba767e1c7c2f1240e6',
          sort_by: sort,
          with_genres: genre.map(genre => genre.id).join(',')
        }
      })

      dispatch(fetchFilteredMoviesSuccess(data, type))
    }
    catch (err) {
      console.log(err)
    }
  }
}

export const fetchNowPlayingMovies = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(NOW_PLAYING_MOVIE, {
        params: {
          api_key: API_KEY
        }
      })
      dispatch(fetchNowPlayingMoviesSuccess(data))
    }
    catch {
      console.log('error')
    }
  }
}

export const fetchUpcomingMovies = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(UPCOMING_MOVIE, {
        params: {
          api_key: API_KEY
        }
      })
      dispatch(fetchUpcomingMoviesSuccess(data))
    }
    catch {
      console.log('error')
    }
  }
}

export const fetchTopRatedMovies = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(TOP_RATED_MOVIE, {
        params: {
          api_key: API_KEY
        }
      })
      dispatch(fetchTopRatedMoviesSuccess(data))
    }
    catch {
      console.log('error')
    }
  }
}

export const fetchAiringTodayTV = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(AIRING_TODAY_TV, {
        params: {
          api_key: API_KEY
        }
      })
      dispatch(fetchAiringTodayTVSuccess(data))
    }
    catch {
      console.log('error')
    }
  }
}

export const fetchOnTheAirTV = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(ON_THE_AIR_TV, {
        params: {
          api_key: API_KEY
        }
      })
      dispatch(fetchOnTheAirTVSuccess(data))
    }
    catch {
      console.log('error')
    }
  }
}

export const fetchTopRatedTV = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(TOP_RATED_TV, {
        params: {
          api_key: API_KEY
        }
      })
      dispatch(fetchTopRatedTVSuccess(data))
    }
    catch {
      console.log('error')
    }
  }
}

export const fetchTrendingToday = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(TRENDING_DAY_URL, {
        params: {
          api_key: API_KEY
        }
      })
      dispatch(fetchTrendingTodaySuccess(data))
    }
    catch {
      console.log('error')
    }
  }
}

export const fetchTrendingWeek = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(TRENDING_WEEK_URL, {
        params: {
          api_key: API_KEY
        }
      })
      dispatch(fetchTrendingWeekSuccess(data))
    }
    catch {
      console.log('error')
    }
  }
}

export const fetchPopularMovie = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(POPULAR_MOVIE, {
        params: {
          api_key: API_KEY
        }
      })

      dispatch(fetchPopularMovieSuccess(data))
      dispatch(fetchTrailerMovie(data.results))
    }
    catch (err) {
      console.log(err)
    }
  }
}

export const fetchPopularTV = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(POPULAR_TV, {
        params: {
          api_key: API_KEY
        }
      })

      dispatch(fetchPopularTVSuccess(data))
      dispatch(fetchTrailerTV(data.results))
    }
    catch {
      console.log('error')
    }
  }
}

export const fetchTrailerMovie = (dataPopular) => {
  return async dispatch => {
    try {
      const popularModified = dataPopular.map(data => (
        {
          id: data.id,
          backdrop: data.backdrop_path,
          title: data.title,
          trailer_url: `${BASE_URL}/movie/${data.id}/videos?api_key=${API_KEY}`
        }
      ))


      const trailerData = await Promise.all(popularModified.map(async (data) => {
        try {
          const res = await axios.get(`${BASE_URL}/movie/${data.id}/videos?api_key=${API_KEY}`)
          const youtubeKey = res.data.results[0].key || ''
          const youtubeRes = await axios.get(YOUTUBE_URL + youtubeKey)

          return {
            ...data,
            video_url: `https://www.youtube.com/watch?v=${res.data.results[0].key}`,
            video_title: res.data.results[0].name,
            publishedAt: youtubeRes.data.items[0].snippet.publishedAt
          }
        } catch (err) {
          return {
            ...data,
            video_title: `No Trailer Found For This Movie`
          }
        }
      }))

      dispatch(fetchTrailerMoviesSuccess(trailerData))
      dispatch(changeTrailerBackdrop(trailerData[0].backdrop))
    }
    catch (err) {
      console.log(err)
    }
  }
}

export const fetchTrailerTV = (dataTV) => {
  return async dispatch => {
    try {
      const popularModified = dataTV.map(data => (
        {
          id: data.id,
          backdrop: data.backdrop_path,
          title: data.name,
          trailer_url: `${BASE_URL}/tv/${data.id}/videos?api_key=${API_KEY}`
        }
      ))

      const trailerData = await Promise.all(popularModified.map(async (data) => {
        try {
          const res = await axios.get(data.trailer_url)
          const youtubeKey = res.data.results[0].key || ''
          const youtubeRes = await axios.get(YOUTUBE_URL + youtubeKey)

          return {
            ...data,
            video_url: `https://www.youtube.com/watch?v=${youtubeKey}`,
            publishedAt: youtubeRes.data.items[0].snippet.publishedAt,
            video_title: youtubeRes.data.items[0].snippet.title
          }
        } catch (err) {
          return {
            ...data,
            video_title: `No Trailer Found`
          }
        }
      }))
      dispatch(fetchTrailerTVSuccess(trailerData))
      dispatch(changeTrailerBackdrop(trailerData[0].backdrop))
    }
    catch (err) {
      console.log(err)
    }
  }
}

export const fetchPopularPeople = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get(POPULAR_PEOPLE, {
        params: {
          api_key: API_KEY
        }
      })
      dispatch(fetchPopularPeopleSuccess(data))
    }
    catch {
      console.log('error')
    }
  }
}

export const clearFilteredMovies = () => {
  return {
    type: actionTypes.CLEAR_FILTERED_MOVIES,
  }
}

export const changeTrailerBackdrop = (url) => {
  return {
    type: actionTypes.CHANGE_TRAILER_BACKDROP,
    url
  }
}

export const changeCategoryPopular = (data) => {
  return {
    type: actionTypes.CHANGE_CATEGORY_POPULAR,
    data
  }
}

export const changeCategoryTrailer = (data) => {
  return {
    type: actionTypes.CHANGE_CATEGORY_TRAILER,
    data
  }
}

export const changeCategoryTrending = (data) => {
  return {
    type: actionTypes.CHANGE_CATEGORY_TRENDING,
    data
  }
}

export const showSidebar = () => {
  return {
    type: actionTypes.SHOW_SIDEBAR,
  }
}

export const showYoutubeModal = (url, title) => {
  return {
    type: actionTypes.SHOW_YOUTUBE_MODAL,
    url,
    title
  }
}

export const fadePage = () => {
  return {
    type: actionTypes.FADE_PAGE
  }
}

export const fetchInit = () => {
  return async dispatch => {
    try {
      dispatch(fetchPopularMovie())
      dispatch(fetchPopularTV())
      dispatch(fetchTrendingToday())
      dispatch(fetchTrendingWeek())
      dispatch(fetchPopularPeople())
      dispatch(fetchNowPlayingMovies())
      dispatch(fetchUpcomingMovies())
      dispatch(fetchTopRatedMovies())
      dispatch(fetchAiringTodayTV())
      dispatch(fetchOnTheAirTV())
      dispatch(fetchTopRatedTV())
    }
    catch {
      console.log('error')
    }
  }
}