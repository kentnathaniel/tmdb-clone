import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../store/actions/mainPage'
import { Link } from 'react-router-dom'
import './PeopleList.css'

const PROFILE_IMAGE_BASE_URL = 'https://themoviedb.org/t/p/w470_and_h470_face'

const PeopleList = () => {
  const popularPeople = useSelector(state => state.popularPeople)

  const dispatch = useDispatch()

  return (
    <div className='page-wrapper'>
      <h1 className='popular-people-title'>Popular People</h1>
      <div className='people-content-wrapper'>
        {popularPeople ? popularPeople.map(({ id, name, profile_path, known_for }) => {
          const starredIn = known_for.reduce((text, movie) => {
            text.push(movie.original_title || movie.name)
            return text
          }, [])

          return (
            <div
              key={'_' + Math.random().toString(36).substr(2, 9)}
              className='popular-card'>
              <Link onClick={() => dispatch(actions.fadePage())} to={`/person/${id}`}><img src={`${PROFILE_IMAGE_BASE_URL}${profile_path}`} alt={name} /></Link>
              <div className='caption'>
                <Link onClick={() => dispatch(actions.fadePage())} to={`/person/${id}`}><h1 className='people-name'>{name}</h1></Link>
                <p>{starredIn.join(', ')}</p>
              </div>
            </div>
          )
        }) : null}
      </div>
    </div>
  )
}

export default PeopleList
