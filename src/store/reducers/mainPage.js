import * as actionTypes from '../actions/actionTypes'

const initialState = {
  details: null,
  popularMovies: null,
  popularTV: null,
  popularPeople: null,
  trendingToday: null,
  trendingWeek: null,
  trailerMovies: null,
  trailerTV: null,
  filteredMovies: null,
  nowPlayingMovies: null,
  upcomingMovies: null,
  topRatedMovies: null,
  airingTodayTV: null,
  onTheAirTV: null,
  topRatedTV: null,
  backdropTrailerUrl: null,
  showYTModal: false,
  showSidebar: false,
  fading: false,
  modalURL: null,
  modalTitle: null,
  categoryPopular: 'On Tv',
  categoryTrailer: 'On Tv',
  categoryTrending: 'Today'
}

const updateState = (state, updatedProperties) => {
  return ({
    ...state,
    ...updatedProperties
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DETAILS:
      return updateState(state, { details: action.data})
    case actionTypes.FETCH_TRENDING_TODAY_SUCCESS:
      return updateState(state, { trendingToday: action.data.results })
    case actionTypes.FETCH_TRENDING_WEEK_SUCCESS:
      return updateState(state, { trendingWeek: action.data.results })
    case actionTypes.FETCH_POPULAR_TV_SUCCESS:
      return updateState(state, { popularTV: action.data.results })
    case actionTypes.FETCH_POPULAR_MOVIES_SUCCESS:
      return updateState(state, { popularMovies: action.data.results })
    case actionTypes.FETCH_TRAILER_MOVIES_SUCCESS:
      return updateState(state, { trailerMovies: action.data })
    case actionTypes.FETCH_TRAILER_TV_SUCCESS:
      return updateState(state, { trailerTV: action.data })
    case actionTypes.FETCH_POPULAR_PEOPLE_SUCCESS:
      return updateState(state, { popularPeople: action.data.results })
    case actionTypes.FETCH_NOW_PLAYING_MOVIES_SUCCESS:
      return updateState(state, { nowPlayingMovies: action.data.results })
    case actionTypes.FETCH_UPCOMING_MOVIES_SUCCESS:
      return updateState(state, { upcomingMovies: action.data.results })
    case actionTypes.FETCH_TOP_RATED_MOVIES_SUCCESS:
      return updateState(state, { topRatedMovies: action.data.results })
    case actionTypes.FETCH_AIRING_TODAY_TV_SUCCESS:
      return updateState(state, { airingTodayTV: action.data.results })
    case actionTypes.FETCH_ON_THE_AIR_TV_SUCCESS:
      return updateState(state, { onTheAirTV: action.data.results })
    case actionTypes.FETCH_TOP_RATED_TV_SUCCESS:
      return updateState(state, { topRatedTV: action.data.results })
    case actionTypes.FETCH_FILTERED_MOVIE_SUCCESS:
      return updateState(state, {filteredMovies: action.data.results})
    case actionTypes.CHANGE_TRAILER_BACKDROP:
      return updateState(state, { backdropTrailerUrl: action.url })
    case actionTypes.SHOW_YOUTUBE_MODAL:
      const prevShowYTModal = state.showYTModal
      return updateState(state, {
        showYTModal: !prevShowYTModal,
        modalURL: action.url,
        modalTitle: action.title
      })
    case actionTypes.SHOW_SIDEBAR:
      const prevShowSidebar = state.showSidebar
      return updateState(state, {
        showSidebar: !prevShowSidebar
      })
    case actionTypes.CLEAR_FILTERED_MOVIES:
      return updateState(state, {
        filteredMovies: null
      })
    case actionTypes.CHANGE_CATEGORY_POPULAR:
      return updateState(state, { categoryPopular: action.data })
    case actionTypes.CHANGE_CATEGORY_TRAILER:
      return updateState(state, { categoryTrailer: action.data })
    case actionTypes.CHANGE_CATEGORY_TRENDING:
      return updateState(state, { categoryTrending: action.data })
    case actionTypes.FADE_PAGE:
      const prevFading = state.fading
      return updateState(state, { fading: !prevFading })
    default:
      return state
  }
}

export default reducer