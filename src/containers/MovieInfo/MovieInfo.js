import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import * as actions from '../../store/actions/mainPage'
import RatingCircle from '../../components/UI/RatingCircle'
import { Swiper, SwiperSlide } from 'swiper/react'
import './MovieInfo.css'
import language from '../../utility/language'
import NoImage from '../../assets/no-image.svg'
import axios from 'axios'

const BASE_BACKGROUND_URL = 'https://themoviedb.org/t/p/w1920_and_h800_multi_faces'
const BASE_PROFILE_URL = 'https://themoviedb.org/t/p/w276_and_h350_face'
const IMAGE_URL = 'https://themoviedb.org/t/p/w300_and_h450_bestv2/'
const BASE_URL = `https://api.themoviedb.org/3`
const API_KEY = `79ff1b0d338aa1ba767e1c7c2f1240e6`

const MovieInfoContext = React.createContext({
  width: 0,
  details: null,
  id: null,
  genre: null
})

const Facts = () => {
  const movieInfoContext = useContext(MovieInfoContext)

  let date = movieInfoContext.details.release_date || movieInfoContext.details.first_air_date
  let runtime = movieInfoContext.details.runtime ?
    movieInfoContext.details.runtime :
    movieInfoContext.details.episode_run_time ?
      movieInfoContext.details.episode_run_time[0] : 0
  let hour = Math.floor(runtime / 60) === 0 ? null : `${Math.floor(runtime / 60)}h`

  return (
    <div className='facts'>
      <p>{moment(date).format('DD/MM/YYYY')}</p>
      <span className='fact fact-genre'>
        {movieInfoContext.details.genres.map((genre, idx, arr) => {
          return <div
            key={'_' + Math.random().toString(36).substr(2, 9)}
          >
            <Link
              to='/'>{`${genre.name}`}
            </Link>
            {idx === arr.length - 1 ? null : ', '}
          </div>
        })}
      </span>
      <span className='fact'>
        {hour ? `${hour} ${runtime % 60}m` : `${runtime % 60}m`}
      </span>
    </div>
  )
}

const Title = () => {
  const movieInfoContext = useContext(MovieInfoContext)

  let date = movieInfoContext.details.release_date || movieInfoContext.details.first_air_date
  let media_type = null


  if (movieInfoContext.details.name) {
    media_type = 'tv'
  } else {
    media_type = 'movie'
  }

  return (
    <div className='title-info'>
      <h1>
        <Link onClick={() => actions.fadePage()} to={`/${media_type}/${movieInfoContext.details.id}`}>{`${movieInfoContext.details.title || movieInfoContext.details.name} `}</Link>
        {date ? <span> ({date.slice(0, 4)})</span> : <span>(-)</span>}
      </h1>
      {movieInfoContext.width > 700 ? <Facts></Facts> : null}
    </div>
  )
}

const Actions = () => {
  const movieInfoContext = useContext(MovieInfoContext)
  const dispatch = useDispatch()
  const [trailerUrl, setTrailerUrl] = useState(null)

  const fetchTrailerUrl = async (url) => {
    try {
      const { data } = await axios.get(url)
      return data.results.length > 0 ? `https://www.youtube.com/watch?v=${data.results[0].key}` : null
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    async function fetching() {
      setTrailerUrl(await fetchTrailerUrl(`${BASE_URL}/${movieInfoContext.genre}/${movieInfoContext.id}/videos?api_key=${API_KEY}`))
    }

    fetching()
  }, [movieInfoContext.id, movieInfoContext.genre])

  return (
    <div className='action-info'>
      <div className='action-rating-wrapper'>
        <RatingCircle rating={movieInfoContext.details.vote_average * 10}></RatingCircle>
        <div className='action-text'>
          User
        {movieInfoContext.width > 700 ? <br /> : ' '}
        Score
      </div>
      </div>
      {movieInfoContext.width > 700 ? null : <div className='pipe'></div>}
      {trailerUrl ? <div
        className='trailer-button'
        onClick={() => dispatch(actions.showYoutubeModal(trailerUrl, (movieInfoContext.details.title || movieInfoContext.details.name)))}
      >
        <span></span>
        Play Trailer</div> : null}
    </div>
  )
}

const OverviewInfo = () => {
  const movieInfoContext = useContext(MovieInfoContext)
  const [filteredCrew, setFilteredCrew] = useState(null)

  const filterCrew = useCallback((crew) => {
    return crew.filter(crew => {
      return ['Director', 'Writer', 'Story', 'Screenplay', 'Characters', 'Novel'].includes(crew.job)
    })
      .sort((a, b) => {
        if (a.job > b.job)
          return 1
        else if (a.job < b.job)
          return -1
        else
          return 0
      })
      .reduce((accCrews, curCrew) => {
        let indexOfCrew = accCrews.findIndex(accCrew => curCrew.name === accCrew.name)
        if (indexOfCrew === -1) {
          accCrews.push({ ...curCrew, jobs: [curCrew.job] })
        } else {
          accCrews[indexOfCrew].jobs.push(curCrew.job)
        }
        return accCrews
      }, [])
      .sort((a, b) => {
        if (a.jobs.length > b.jobs.length)
          return -1
        else if (a.jobs.length < b.jobs.length)
          return 1
        else
          return 0
      })
  }, [])

  useEffect(() => {
    setFilteredCrew(filterCrew(movieInfoContext.details.credits.crew))
  }, [filterCrew, movieInfoContext])

  return (
    <div className='overview-info'>
      <p className='tagline'>{movieInfoContext.details.tagline}</p>
      <h3>Overview</h3>
      <p>{movieInfoContext.details.overview}</p>
      <div className='overview-crew-info'>
        <ol>
          {filteredCrew ? filteredCrew.map((crew) => (
            <div
              key={'_' + Math.random().toString(36).substr(2, 9)}
              className='crew-list'>
              <a href={`/person/${crew.id}`}>{crew.name}</a>
              <p>{crew.jobs.join(', ')}</p>
            </div>
          )) : null}
        </ol>
      </div>
    </div>
  )
}

const DetailInfo = () => {
  const movieInfoContext = useContext(MovieInfoContext)

  return (
    <div className='detail-info'>
      <Title></Title>
      <Actions></Actions>
      {movieInfoContext.width > 700 ? null : <Facts></Facts>}
      <OverviewInfo></OverviewInfo>
    </div>
  )
}

const Casts = () => {
  const dispatch = useDispatch()
  const movieInfoContext = useContext(MovieInfoContext)

  return (
    <div className='cast'>
      <h3 style={{ fontWeight: '600', fontSize: '22.4px' }}>Top Billed Cast</h3>
      { movieInfoContext.details.credits.cast.length > 0 ?
        <Swiper slidesPerView={'auto'}>
          {movieInfoContext.details.credits.cast.slice(0, 10).map(cast => {
            return (
              <SwiperSlide
                key={'_' + Math.random().toString(36).substr(2, 9)}
              >
                <div className='profile-container'>
                  <div
                    className={`profile-image-container`}>
                    <Link to={`/person/${cast.id}`}
                      onClick={() => {
                        dispatch(actions.fadePage())
                      }}>
                      {
                        cast.profile_path ?
                          <img
                            src={`${BASE_PROFILE_URL}${cast.profile_path}`}
                            alt={cast.name}></img>
                          : <div className='no-person-image'>
                          </div>
                      }
                    </Link>
                  </div>
                  <div className='cast-info'>
                    <Link to={`/person/${cast.id}`} onClick={() => dispatch(actions.fadePage())}>
                      <p className='cast-name'>{cast.name}</p>
                    </Link>
                    <p>{cast.character}</p>
                  </div>
                </div>
              </SwiperSlide>)
          })}
        </Swiper>
        : <p>We don't have any cast added to this movie.</p>
      }
    </div>
  )
}

const SideInfo = () => {
  const movieInfoContext = useContext(MovieInfoContext)
  const keywords = movieInfoContext.details.keywords.keywords || movieInfoContext.details.keywords.results

  let keywordsRender = null
  if (keywords.length > 0) {
    keywordsRender = (
      <ul>
        {
          keywords.map(keyword => <li
            key={'_' + Math.random().toString(36).substr(2, 9)}
          >{keyword.name}</li>)
        }
      </ul>
    )
  } else {
    keywordsRender = (
      <p> No keywords have been added. </p>
    )
  }

  return (
    <div className='side-info'>
      <div className='visit-info'>
        {movieInfoContext.details.external_ids.facebook_id ?
          <div className='icons'>
            <a target='_blank'
              rel="noreferrer"
              className='external-links'
              href={`https://facebook.com/${movieInfoContext.details.external_ids.facebook_id}`}>
              <span className='facebook-icon'></span>
            </a>
          </div>
          : null}
        {movieInfoContext.details.external_ids.twitter_id ?
          <div className='icons'>
            <a target='_blank'
              rel="noreferrer"
              className='external-links'
              href={`https://twitter.com/${movieInfoContext.details.external_ids.twitter_id}`}>
              <span className='twitter-icon'></span>
            </a>
          </div>
          : null}
        {movieInfoContext.details.external_ids.instagram_id ?
          <div className='icons'>
            <a
              rel="noreferrer"
              target='_blank'
              className='external-links'
              href={`https://instagram.com/${movieInfoContext.details.external_ids.instagram_id}`}>
              <span className='insta-icon'></span>
            </a>
          </div>
          : null}
      </div>
      <h1>Facts</h1>
      <h2> Status</h2>
      <p> {movieInfoContext.details.status}</p>
      <h2> Original Language</h2>
      <p> {language[movieInfoContext.details.original_language].name}</p>
      {movieInfoContext.details.budget ?
        <>
          <h2> Budget</h2>
          <p> {movieInfoContext.details.budget.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}</p>
        </>
        : null
      }
      {movieInfoContext.details.revenue ?
        <>
          <h2> Revenue</h2>
          <p> {movieInfoContext.details.revenue === 0 ? '-' : movieInfoContext.details.revenue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}</p>
        </>
        : null
      }
      {keywords ?
        <>
          <h2> Keywords </h2>
          {keywordsRender}
        </> : null}
    </div>
  )
}

const GeneralInfo = () => {
  const movieInfoContext = useContext(MovieInfoContext)

  return (
    <>
      { movieInfoContext.width > 700 ?
        <div
          style={{ backgroundImage: `url('${BASE_BACKGROUND_URL}${movieInfoContext.details.backdrop_path}')` }}
          className='jumbotron-info-wrapper'>
          <div className='gradient-jumbotron'>
            <div
              className='image-info'>
              <img
                alt={movieInfoContext.details.name || movieInfoContext.details.title}
                src={movieInfoContext.details.poster_path ? `${IMAGE_URL}${movieInfoContext.details.poster_path}` : NoImage}></img>
            </div>
            <DetailInfo></DetailInfo>
          </div>
        </div> :
        <div
          className='info-wrapper-700px'>
          <div
            className='image-info-700px'
            style={{ backgroundImage: `url('${BASE_BACKGROUND_URL}${movieInfoContext.details.backdrop_path}')` }}>
            <div className='gradient-700px'></div>
            <img
              alt={movieInfoContext.details.name || movieInfoContext.details.title}
              src={`${IMAGE_URL}${movieInfoContext.details.poster_path}`}></img>
          </div>
          <DetailInfo></DetailInfo>
        </div>
      }
    </>
  )
}

const MovieInfo = (props) => {
  const [width, setWidth] = useState(0)
  const details = useSelector(state => state.details)

  const dispatch = useDispatch()

  const updateDimensions = useCallback(() => {
    setWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [updateDimensions])

  useEffect(() => {
    const id = props.match.params.id.match(/^[0-9]*/)
    const genre = props.match.params.genre
    dispatch(actions.fetchDetails(id, genre))
  }, [dispatch, props])

  return (
    <MovieInfoContext.Provider
      value={{
        width: width,
        details: details,
        id: props.match.params.id.match(/^[0-9]*/),
        genre: props.match.params.genre,
      }}
    >
      <div className='info-page-wrapper'>
        {details ?
          <>
            <GeneralInfo></GeneralInfo>
            <div className='info-content-wrapper'>
              <Casts></Casts>
              <SideInfo></SideInfo>
            </div>
          </>
          : null
        }
      </div>
    </MovieInfoContext.Provider>
  )
}

export default MovieInfo
