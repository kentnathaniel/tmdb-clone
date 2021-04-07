import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import MovieContainer from '../MovieContainer'
import './SearchPage.css'
import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3'
const PROFILE_IMAGE_URL = 'https://themoviedb.org/t/p/w180_and_h180_face'

const fetchSearchInit = async (query) => {
  try {
    const searchObj = [
      {
        category: 'Movies',
        endPoint: 'movie'
      },
      {
        category: 'TV Shows',
        endPoint: 'tv'
      },
      {
        category: 'People',
        endPoint: 'person'
      },
      {
        category: 'Companies',
        endPoint: 'company'
      },
      {
        category: 'Keywords',
        endPoint: 'keyword'
      },
      {
        category: 'Collections',
        endPoint: 'collection'
      }
    ]

    const searchInitResult = await Promise.all(searchObj.map(async (search) => {
      try {
        let { data } = await axios.get(`${BASE_URL}/search/${search.endPoint}`, {
          params: {
            api_key: '79ff1b0d338aa1ba767e1c7c2f1240e6',
            query: query
          }
        })

        data.results = data.results.map(result => {
          return {
            ...result,
            media_type: search.endPoint
          }
        })

        return {
          ...data,
          ...search
        }
      } catch (err) {
        console.log(err)
      }
    }))

    return searchInitResult
  }
  catch (err) {
    console.log(err)
  }
}

const Panel = ({ props, searchResult }) => {
  const widthContext = useContext(WidthContext)

  let panelMenu = null

  if (widthContext.width < 700) {
    panelMenu = (
      <Swiper slidesPerView={'auto'}>
        {searchResult.map(result => {
          let selected = ''
          if (result.endPoint === props.match.params.type) {
            selected = 'selected'
          }
          return (
            <SwiperSlide key={'_' + Math.random().toString(36).substr(2, 9)}>
              <li className={selected}>
                <Link to={`/search/${result.endPoint}/${props.location.search}`}> {result.category} </Link>
                <span> {result.total_results} </span>
              </li>
            </SwiperSlide>
          )
        })}
      </Swiper>
    )
  } else {
    panelMenu = (
      <ul>
        {searchResult.map(result => {
          let selected = ''
          if (result.endPoint === props.match.params.type) {
            selected = 'selected'
          }
          return (
            <li
              key={'_' + Math.random().toString(36).substr(2, 9)}
              className={selected}>
              <Link to={`/search/${result.endPoint}/${props.location.search}`}> {result.category} </Link>
              <span> {result.total_results} </span>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className='search-panel'>
      <div className='header-panel'>
        <h1>Search Results</h1>
      </div>
      <div className='menu-panel'>
        {panelMenu}
      </div>
    </div >
  )
}

const Content = ({ props, searchResult }) => {
  const type = props.match.params.type
  const renderedContent = searchResult.find(result => result.endPoint === type)
  let rendered = null

  switch (type) {
    case 'movie':
    case 'tv':
      rendered = (
        <>
          <MovieContainer stylingType={5} movies={renderedContent.results}></MovieContainer>
        </>
      )
      break
    case 'person':
      rendered = (
        <div className='person-search-container'>
          {renderedContent.results.map(result => (
            <div className='person-search-result'>
              <div className='person-profile-photo'>
                <Link>
                  <div
                    className={`person-photo ${result.profile_path ? '' : 'person-no-image'}`}>
                    {result.profile_path ?
                      <img
                        alt={result.name}
                        src={`${PROFILE_IMAGE_URL}${result.profile_path}`}></img>
                      : null}
                  </div>
                </Link>
              </div>
              <div className='person-search-info'>
                <Link to={`/person/${result.id}`} className='person-name'>{result.name}</Link>
                <p>
                  <span>{result.known_for_department} </span>
                  {` • `}
                  {result.known_for.map((movie, idx, arr) => {
                    return idx === arr.length - 1 ?
                      <Link>{movie.title || movie.name}</Link> :
                      <>
                        <Link>{movie.title || movie.name}</Link>
                        {`, `}
                      </>
                  })}
                </p>

              </div>
            </div>
          ))}
        </div>
      )
      break
    case 'company':
    case 'keyword':
    case 'collection':
      rendered = (
        <>
          {renderedContent.results.map(result => <p>{result.name}</p>)}
        </>
      )
      break
    default:
      break
  }

  return (
    <>
      {rendered}
    </>
  )
}

const WidthContext = React.createContext({
  width: 0
})

const SearchPage = (props) => {
  const [searchResult, setSearchResult] = useState(null)

  const [width, setWidth] = useState(0)

  const updateDimensions = useCallback(() => {
    setWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
  }, [updateDimensions])

  useEffect(() => {
    const query = new URLSearchParams(props.location.search);
    let queryParse = []
    for (let param of query.entries()) {
      queryParse.push(param)
    }

    async function fetching() {
      setSearchResult(await fetchSearchInit(queryParse[0][1]))
    }

    fetching()
  }, [props.location.search])

  return (
    <WidthContext.Provider
      value={{
        width: width
      }}
    >
      <div className='search-page-wrapper'>
        <div className='side-search-page'>
          {searchResult ? <Panel props={props} searchResult={searchResult}></Panel> : null}
        </div>
        <div className='search-result-wrapper'>
          {searchResult ? <Content props={props} searchResult={searchResult}></Content> : null}
        </div>
      </div>
    </WidthContext.Provider>
  )
}

export default SearchPage