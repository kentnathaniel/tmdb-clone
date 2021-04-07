import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../store/actions/mainPage'
import Panel from '../../components/Panel/Panel'
import MovieContainer from '../MovieContainer'
import './MovieList.css'

const MoviePage = (props) => {
  const category = props.match.params.category || 'popular'
  
  const movies = useSelector(state => {
    switch (props.match.params.genre) {
      case ('movie'):
        switch (category) {
          case ('popular'):
            return state.popularMovies
          case ('now-playing'):
            return state.nowPlayingMovies
          case ('upcoming'):
            return state.upcomingMovies
          case ('top-rated'):
            return state.topRatedMovies
          default:
            return null
        }
      case ('tv'):
        switch (category) {
          case ('popular'):
            return state.popularTV
          case ('airing-today'):
            return state.airingTodayTV
          case ('on-the-air'):
            return state.onTheAirTV
          case ('top-rated'):
            return state.topRatedTV
          default:
            return null
        }
      default:
        return null
    }
  })

  const filteredMovies = useSelector(state => state.filteredMovies)

  const fading = useSelector(state => {
    return state.fading ? 'fading' : null
  })

  const dispatch = useDispatch()

  let renderedMovies = null

  if (filteredMovies) {
    renderedMovies = (
      <MovieContainer movies={filteredMovies} />
    )
  } else if (movies) {
    renderedMovies = (
      <MovieContainer movies={movies} />
    )
  }

  return (
    <div
      className={`page-wrapper`}>
      <h1>{`${category.replace(/-/g, ' ')} ${props.match.params.genre}`}</h1>
      <div className='page-content-wrapper'>
        <Panel type={props.match.params.genre}></Panel>
        <div
          className={`movie-content-wrapper ${fading}`}
          onAnimationEnd={() => dispatch(actions.fadePage())}>
          {renderedMovies ? renderedMovies : null}
        </div>
      </div>
    </div>
  )
}

export default MoviePage
