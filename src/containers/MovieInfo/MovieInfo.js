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

const filterCrew = (crew) => {
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
}

const Facts = ({ details }) => {
  let date = details.release_date || details.first_air_date
  let runtime = details.runtime ?
    details.runtime :
    details.episode_run_time ?
      details.episode_run_time[0] : 0
  let hour = Math.floor(runtime / 60) === 0 ? null : `${Math.floor(runtime / 60)}h`

  return (
    <div className='facts'>
      <p>{moment(date).format('DD/MM/YYYY')}</p>
      <span className='fact fact-genre'>
        {details.genres.map((genre, idx, arr) => {
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

const Title = ({ details }) => {
  const widthContext = useContext(WidthContext)

  let date = details.release_date || details.first_air_date
  let media_type = null


  if (details.name) {
    media_type = 'tv'
  } else {
    media_type = 'movie'
  }

  return (
    <div className='title-info'>
      <h1>
        <Link onClick={() => actions.fadePage()} to={`/${media_type}/${details.id}`}>{`${details.title || details.name} `}</Link>
        {date ? <span> ({date.slice(0, 4)})</span> : <span>(-)</span>}
      </h1>
      {widthContext.width > 700 ? <Facts details={details}></Facts> : null}
    </div>
  )
}

const Actions = ({ details, props }) => {
  const id = props.match.params.id.match(/^[0-9]*/)
  const genre = props.match.params.genre
  const dispatch = useDispatch()
  const [trailerUrl, setTrailerUrl] = useState(null)

  const widthContext = useContext(WidthContext)

  useEffect(() => {
    async function fetching() {
      setTrailerUrl(await fetchTrailerUrl(`${BASE_URL}/${genre}/${id}/videos?api_key=${API_KEY}`))
    }

    fetching()
  }, [id, genre])

  return (
    <div className='action-info'>
      <div className='action-rating-wrapper'>
        <RatingCircle rating={details.vote_average * 10}></RatingCircle>
        <div className='action-text'>
          User
        {widthContext.width > 700 ? <br /> : ' '}
        Score
      </div>
      </div>
      {widthContext.width > 700 ? null : <div className='pipe'></div>}
      <div
        className='trailer-button'
        onClick={() => dispatch(actions.showYoutubeModal(trailerUrl, (details.title || details.name)))}
      >
        <span></span>
        Play Trailer</div>
    </div>
  )
}

const OverviewInfo = ({ details }) => {
  const filteredCrew = filterCrew(details.credits.crew)

  return (
    <div className='overview-info'>
      <p className='tagline'>{details.tagline}</p>
      <h3>Overview</h3>
      <p>{details.overview}</p>
      <div className='overview-crew-info'>
        <ol>
          {filteredCrew.map((crew) => (
            <div
              key={'_' + Math.random().toString(36).substr(2, 9)}
              className='crew-list'>
              <Link to={`/person/${crew.id}`}>{crew.name}</Link>
              <p>{crew.jobs.join(', ')}</p>
            </div>
          ))}
        </ol>
      </div>
    </div>
  )
}

const DetailInfo = ({ details, props }) => {
  const widthContext = useContext(WidthContext)

  return (
    <div className='detail-info'>
      <Title details={details}></Title>
      <Actions props={props} details={details}></Actions>
      {widthContext.width > 700 ? null : <Facts details={details}></Facts>}
      <OverviewInfo details={details}></OverviewInfo>
    </div>
  )
}

const Casts = ({ casts }) => {
  const dispatch = useDispatch()

  return (
    <div className='cast'>
      <h3 style={{ fontWeight: '600', fontSize: '22.4px' }}>Top Billed Cast</h3>
      <Swiper slidesPerView={'auto'}>
        {casts.slice(0, 10).map(cast => {
          return (
            <SwiperSlide
              key={'_' + Math.random().toString(36).substr(2, 9)}
            >
              <div className='profile-container'>
                <div
                  className={`profile-image-container`}>
                  <Link to={`/person/${cast.id}`} onClick={() => dispatch(actions.fadePage())}>
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
    </div>
  )
}

const SideInfo = ({ details }) => {
  let keywords = details.keywords.keywords || details.keywords.results
  return (
    <div className='side-info'>
      <div className='visit-info'>
        {details.external_ids.facebook_id ?
          <div className='icons'>
            <a target='_blank'
              rel="noreferrer"
              className='external-links'
              href={`https://facebook.com/${details.external_ids.facebook_id}`}>
              <span className='facebook-icon'></span>
            </a>
          </div>
          : null}
        {details.external_ids.twitter_id ?
          <div className='icons'>
            <a target='_blank'
              rel="noreferrer"
              className='external-links'
              href={`https://twitter.com/${details.external_ids.twitter_id}`}>
              <span className='twitter-icon'></span>
            </a>
          </div>
          : null}
        {details.external_ids.instagram_id ?
          <div className='icons'>
            <a
              rel="noreferrer"
              target='_blank'
              className='external-links'
              href={`https://instagram.com/${details.external_ids.instagram_id}`}>
              <span className='insta-icon'></span>
            </a>
          </div>
          : null}
      </div>
      <h1>Facts</h1>
      <h2> Status</h2>
      <p> {details.status}</p>
      <h2> Original Language</h2>
      <p> {language[details.original_language].name}</p>
      {details.budget ?
        <>
          <h2> Budget</h2>
          <p> {details.budget.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}</p>
        </>
        : null
      }
      {details.revenue ?
        <>
          <h2> Revenue</h2>
          <p> {details.revenue === 0 ? '-' : details.revenue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}</p>
        </>
        : null
      }
      {keywords ?
        <>
          <h2> Keywords </h2>
          <ul>
            {keywords.map(keyword => <li
              key={'_' + Math.random().toString(36).substr(2, 9)}
            >{keyword.name}</li>)}
          </ul>
        </> : null}
    </div>
  )
}

const GeneralInfo = ({ details, props }) => {
  const widthContext = useContext(WidthContext)

  return (
    <>
      { widthContext.width > 700 ?
        <div
          style={{ backgroundImage: `url('${BASE_BACKGROUND_URL}${details.backdrop_path}')` }}
          className='jumbotron-info-wrapper'>
          <div className='gradient-jumbotron'>
            <div
              className='image-info'>
              <img
                alt={details.name || details.title}
                src={details.poster_path ? `${IMAGE_URL}${details.poster_path}` : NoImage}></img>
            </div>
            <DetailInfo props={props} details={details}></DetailInfo>
          </div>
        </div> :
        <div
          className='info-wrapper-700px'>
          <div
            className='image-info-700px'
            style={{ backgroundImage: `url('${BASE_BACKGROUND_URL}${details.backdrop_path}')` }}>
            <div className='gradient-700px'></div>
            <img
              alt={details.name || details.title}
              src={`${IMAGE_URL}${details.poster_path}`}></img>
          </div>
          <DetailInfo props={props} details={details}></DetailInfo>
        </div>
      }
    </>
  )
}

const WidthContext = React.createContext({
  width: 0
})

const fetchTrailerUrl = async (url) => {
  const { data } = await axios.get(url)
  return data.results ? `https://www.youtube.com/watch?v=${data.results[0].key}` : null
}

const MovieInfo = (props) => {
  const id = props.match.params.id.match(/^[0-9]*/)
  const genre = props.match.params.genre
  const [width, setWidth] = useState(0)
  const details = useSelector(state => state.details)

  const dispatch = useDispatch()

  const updateDimensions = useCallback(() => {
    setWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
  }, [updateDimensions])

  useEffect(() => {
    dispatch(actions.fetchDetails(id, genre))
  }, [dispatch, id, genre])

  return (
    <WidthContext.Provider
      value={{
        width: width
      }}
    >
      <div className='info-page-wrapper'>
        {details ?
          <>
            <GeneralInfo props={props} details={details}></GeneralInfo>
            <div className='info-content-wrapper'>
              <Casts casts={details.credits.cast}></Casts>
              <SideInfo details={details}></SideInfo>
            </div>
          </>
          : null
        }
      </div>
    </WidthContext.Provider>
  )
}

export default MovieInfo
