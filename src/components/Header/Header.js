import tmdbHeader from '../../assets/tmdb-header.svg'
import tmdbHeaderSmall from '../../assets/tmdb-header-smallscreen.svg'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '../../store/actions/mainPage'
import Navigation from '../Navigation'
import './Header.css'

const BASE_URL = `https://api.themoviedb.org/3`
const API_KEY = `79ff1b0d338aa1ba767e1c7c2f1240e6`

const fetchSearch = async (query) => {
  const { data } = await axios.get(`${BASE_URL}/search/multi`, {
    params: {
      api_key: API_KEY,
      query: query
    }
  })

  return data.results
}

const Header = React.memo((props) => {
  const [width, setWidth] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const [enteredKeyword, setEnteredKeyword] = useState('')
  const searchRef = useRef()

  const dispatch = useDispatch()

  const updateDimensions = useCallback(() => {
    setWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
  }, [updateDimensions])

  const hamburger = (
    <div className='hamburger-button'>
      <span onClick={props.hamburgerHandler}></span>
    </div>
  )

  const linkClickHandler = () => {
    setShowSearch(false)
    setSearchResult(null)
    setEnteredKeyword('')
    dispatch(actions.fadePage())
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (enteredKeyword === searchRef.current.value && enteredKeyword.length > 0) {
        setSearchResult(await fetchSearch(enteredKeyword))
      }
      else if (enteredKeyword.length === 0) {
        setSearchResult(null)
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredKeyword, searchRef])

  return (
    <>
      <header>
        <div className="header-wrapper">
          {width < 650 ? hamburger : null}
          <div className="image-wrapper">
            <Link onClick={() => dispatch(actions.fadePage())} to='/'><img alt='logo-tmdb' src={width > 650 ? tmdbHeader : tmdbHeaderSmall}></img></Link>
            {width > 650 ? <Navigation type={1} /> : null}
          </div>
          <span className={`search-span ${showSearch ? 'hide-image' : ''}`} onClick={() => { setShowSearch(!showSearch) }}></span>
        </div>
      </header>
      <div className={`search-bar-header ${showSearch ? '' : 'hide-search-bar'}`}>
        <form
          onSubmit={e => e.preventDefault()}>
          <label>
            <span>
              <input value={enteredKeyword} ref={searchRef} onChange={(e) => { setEnteredKeyword(e.target.value) }} placeholder='Search for a movie, tv show, person...'></input>
            </span>
          </label>
        </form>
      </div>
      {searchResult && enteredKeyword !== '' ? <div className={`search-bar-result ${showSearch ? '' : 'hide-search-bar'}`}>
        <ul>
          {searchResult.length > 0 ?
            searchResult.slice(0, 10).map(result => (
              <li key={'_' + Math.random().toString(36).substr(2, 9)}>
                <Link onClick={() => linkClickHandler()} to={`/search/${result.media_type}?query=${result.title || result.name}`}>
                  <div className='search-icon'></div>
                  <p>{result.title || result.name}</p>
                </Link>
              </li>
            ))
            : <div className='no-results'>
              <p>NO RESULTS</p>
            </div>
          }
        </ul>
      </div> : null}
    </>
  )
})

export default Header