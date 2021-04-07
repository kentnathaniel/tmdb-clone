import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'
import NoImage from '../assets/no-image.svg'
import './Movie.css'
import * as actions from '../store/actions/mainPage'
import RatingCircle from './UI/RatingCircle'

const Movie = ({ id, name, title, poster_path, date, media, stylingType, video_url, video_title, scrollPosition, overview, rating }) => {
  // const genres = genre === 'tv' ? 'Tv Shows' : 'Movies'
  const BASE_URL = stylingType === 2 ?
    `https://image.tmdb.org/t/p/w355_and_h200_multi_faces`
    : `https://image.tmdb.org/t/p/w220_and_h330_face`

  //Dispatches
  const dispatch = useDispatch()

  const movieClickHandler = useCallback(() => {
    dispatch(actions.showYoutubeModal(video_url, title))
  }, [dispatch, video_url, title])

  const titleAndDate = (
    <>
      <Link onClick={() => dispatch(actions.fadePage())} to={`/${media}/${id}`}>
        <h2>{name || title}</h2>
      </Link>
      {stylingType === 2 ?
        <p style={{ textAlign: 'center' }}>{video_title}</p>
        : stylingType === 5 && date !== 'no-date' ?
          <p>{moment(date).format('MMMM DD, YYYY')}</p>
          : date !== 'no-date' ?
            <p>{moment(date).format('MMM DD, YYYY')}</p>
            : null
      }
    </>
  )

  return (
    <>
      <div
        onClick={() => stylingType === 2 ? movieClickHandler() : null}
        className={`poster-container-${stylingType}`}>
        {stylingType === 2 ?
          <>
            <img
              src={poster_path ? `${BASE_URL}${poster_path}` : NoImage}
              alt={title || name}
            ></img>
            <span className={`span-style-${stylingType}`}></span>
          </>
          : <Link onClick={() => dispatch(actions.fadePage())} to={`/${media}/${id}`}>
            <img
              src={poster_path ? `${BASE_URL}${poster_path}` : NoImage}
              data-src={BASE_URL + poster_path}
              alt={title || name}
            ></img>
          </Link>}
      </div>
      <div className={`caption-styling caption-styling-${stylingType}`}>
        {
          stylingType !== 5 && stylingType !== 2 ?
            <RatingCircle rating={rating}></RatingCircle>
            : null
        }

        {stylingType === 5 ?
          <div className={'wrapper-title-date'}>
            {titleAndDate}
          </div>
          : <>
            {titleAndDate}
          </>
        }

        {
          stylingType === 4 || stylingType === 5 ?
            <div className='overview-movie'>
              <p>
                {overview}
              </p>
            </div>
            : null
        }
      </div>
    </>
  )
}

export default Movie