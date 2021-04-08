import axios from 'axios'
import React, { useEffect, useState, useCallback } from 'react'
import * as actions from '../../store/actions/mainPage'
import { useDispatch } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Link } from 'react-router-dom'
import './PeopleInfo.css'

const BASE_URL = 'https://api.themoviedb.org/3/'
const IMAGE_URL = 'https://themoviedb.org/t/p/w300_and_h450_bestv2/'
const IMAGE_URL_700PX = 'https://themoviedb.org/t/p/w235_and_h235_face/'
const MOVIE_IMAGE_URL = 'https://themoviedb.org/t/p/w150_and_h225_bestv2/'

const fetchPersonDetailts = async (id) => {
  try {
    const result = await axios.get(`${BASE_URL}person/${id}`, {
      params: {
        api_key: '79ff1b0d338aa1ba767e1c7c2f1240e6',
        append_to_response: 'external_ids,combined_credits,images'
      }
    })
    return result.data
  } catch (err) {
    console.log(err)
  }
}

const ActingDetails = ({ personDetails }) => {
  const dispatch = useDispatch()

  const sortedMovieByYear = personDetails.combined_credits.cast
    .sort((a, b) => {
      let aDate = (new Date(a.release_date || a.first_air_date).getTime() || Infinity)
      let bDate = new Date(b.release_date || b.first_air_date).getTime()
      return bDate - aDate
    }
    )

  const groupingMovieByYear = sortedMovieByYear.reduce((accArr, curCast) => {
    let curYear = new Date(curCast.release_date || curCast.first_air_date).getFullYear()
    let indexOfCurYear = accArr.findIndex(accElement => curYear === accElement.year)
    if (indexOfCurYear === -1) {
      accArr.push({
        year: curYear,
        movies: [{
          id: curCast.id,
          title: (curCast.title || curCast.name),
          character: curCast.character,
          media_type: curCast.media_type
        }]
      })
    } else {
      accArr[indexOfCurYear].movies.push({
        id: curCast.id,
        title: (curCast.title || curCast.name),
        character: curCast.character,
        media_type: curCast.media_type
      })
    }
    return accArr
  }, [])

  const renderToScreen = groupingMovieByYear.map(castsAtYear => {
    return (<tr
      key={'_' + Math.random().toString(36).substr(2, 9)}
      className='column-border'>
      {
        castsAtYear.movies.map(cast => <tr key={'_' + Math.random().toString(36).substr(2, 9)}>
          <td>
            {castsAtYear.year || '—'}
          </td>
          <td>
            <Link
              onClick={() => {
                dispatch(actions.fadePage())
              }}
              to={`/${cast.media_type}/${cast.id}`}>{cast.title}</Link> {cast.character ? <span>as</span> : null} {cast.character}
          </td>
        </tr>)
      }
    </tr >)
  })

  return renderToScreen
}

const PeopleInfo = (props) => {
  const [width, setWidth] = useState(0)
  const [personDetails, setPersonDetails] = useState(null)
  const id = props.match.params.id

  const dispatch = useDispatch()

  useEffect(() => {
    async function fetching() {
      setPersonDetails(await fetchPersonDetailts(id))
    }

    fetching()
  }, [id])

  const updateDimensions = useCallback(() => {
    setWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
  }, [updateDimensions])

  let renderedToScreen = null

  if (personDetails && width) {
    const baseImagePath = width > 700 ? IMAGE_URL : IMAGE_URL_700PX
    const imagesSort = personDetails.images.profiles.sort
      ((a, b) => b.vote_count - a.vote_count)
    const sourcePath = personDetails.images.profiles.length > 0 ?
      imagesSort[0].file_path
      : null
    const extendedPath = baseImagePath.concat(sourcePath)

    renderedToScreen = (
      <>
        <div className={`people-detail-side-info`}>
          <img
            alt={personDetails.name}
            className={personDetails.images.profiles.length > 0 ? '' : 'no-image'}
            src={personDetails.images.profiles.length > 0 ? extendedPath : null}>
          </img>
          {width < 700 ? <h1>{personDetails.name}</h1> : null}
          <div className='visit-info'>
            {personDetails.external_ids.facebook_id ?
              <div className='icons'>
                <a
                  rel="noreferrer"
                  target='_blank'
                  className='external-links'
                  href={`https://facebook.com/${personDetails.external_ids.facebook_id}`}>
                  <span className='facebook-icon'></span>
                </a>
              </div>
              : null}
            {personDetails.external_ids.twitter_id ?
              <div className='icons'>
                <a
                  rel="noreferrer"
                  target='_blank'
                  className='external-links'
                  href={`https://twitter.com/${personDetails.external_ids.twitter_id}`}>
                  <span className='twitter-icon'></span>
                </a>
              </div>
              : null}
            {personDetails.external_ids.instagram_id ?
              <div className='icons'>
                <a
                  rel="noreferrer"
                  target='_blank'
                  className='external-links'
                  href={`https://instagram.com/${personDetails.external_ids.instagram_id}`}>
                  <span className='insta-icon'></span>
                </a>
              </div>
              : null}
          </div>
          <section>
            <h2 className='full'>Personal Info</h2>
            <div className='people-side-info-content'>
              <h3>Known For</h3>
              <p>{personDetails.known_for_department}</p>
            </div>
            <div className='people-side-info-content'>
              <h3>Known Credits</h3>
              <p>{personDetails.combined_credits.cast.length + personDetails.combined_credits.crew.length}</p>
            </div>
            <div className="people-side-info-content">
              <h3>Gender</h3>
              <p>{personDetails.gender === 1 ? 'Female' : 'Male'}</p>
            </div>
            <div className="people-side-info-content full">
              <h3>Birthday</h3>
              <p>{personDetails.birthday}</p>
            </div>
            <div className="people-side-info-content full">
              <h3>Place of Birth</h3>
              <p>{personDetails.place_of_birth}</p>
            </div>
            {width > 700 ? <div className="people-side-info-content">
              <h3>Also Known As</h3>
              {personDetails.also_known_as
                .map(known => <p key={'_' + Math.random().toString(36).substr(2, 9)}>{known}</p>)}
            </div> : null}
          </section>
        </div>
        <div className='people-detail-main-info'>
          {width > 700 ? <section>
            <h1>{personDetails.name}</h1>
          </section> : null}
          <section className='biography-wrapper'>
            <h2>Biography</h2>
            {personDetails.biography === '' ?
              <p>We don't have a biography for {personDetails.name}</p>
              : personDetails.biography.split("\n\n")
                .map(paragraph => <p key={'_' + Math.random().toString(36).substr(2, 9)}>{paragraph}</p>)}
          </section>
          <section className='known-for-wrapper'>
            <h2>Known For</h2>
            <Swiper
              slidesPerView={'auto'}>
              {personDetails.combined_credits.cast
                .sort((a, b) => b.vote_count - a.vote_count)
                .slice(0, 9)
                .map(cast => <SwiperSlide key={'_' + Math.random().toString(36).substr(2, 9)}>
                  <div className='people-movie-container'>
                    <Link
                      onClick={() => {
                        dispatch(actions.fadePage())
                      }}
                      to={`/${cast.media_type}/${cast.id}`}>
                      <img
                        alt={cast.title || cast.name}
                        src={cast.poster_path ? `${MOVIE_IMAGE_URL}${cast.poster_path}` : null}></img>
                    </Link>
                    <Link onClick={() => dispatch(actions.fadePage())} to={`/${cast.media_type}/${cast.id}`}><p>{cast.title || cast.name}</p></Link>
                  </div>
                </SwiperSlide>)}
            </Swiper>
          </section>
          <section className='acting-wrapper'>
            <h2>Acting</h2>
            <table>
              <tbody>
                <ActingDetails key={'_' + Math.random().toString(36).substr(2, 9)} personDetails={personDetails} ></ActingDetails>
              </tbody>
            </table>
          </section>
        </div>
      </>
    )
  }

  return (
    <div className='people-info-wrapper'>
      {renderedToScreen}
    </div>
  )
}

export default PeopleInfo