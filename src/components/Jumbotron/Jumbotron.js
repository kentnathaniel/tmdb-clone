import React, { useState, useEffect, useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import './Jumbotron.css'

const Jumbotron = () => {
  const [width, setWidth] = useState(0)
  const [valueInput, setValueInput] = useState('')
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const updateDimensions = useCallback(() => {
    setWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
  }, [updateDimensions])

  const submitHandler = (e) => {
    e.preventDefault()
    setShouldRedirect(true)
  }

  return (
    <>
      <div className='my-jumbotron'>
        <div className='jumbotron-wrapper'>
          <div className='content'>
            <h1 className='display-3'>Welcome.</h1>
            <h2>Millions of movies, TV shows and people to discover. Explore now.</h2>
          </div>
          <div className='search'>
            <form

              onSubmit={e => submitHandler(e)}
            >
              <input
                className='input-bar'
                placeholder={width > 450 ? 'Search for a movie, tv show, person......' : 'Search...'}
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)} />
              <input
                className='submit-bar'
                type='submit'
                value='Search' />
            </form>
          </div>
        </div>
      </div>
      {shouldRedirect ? <Redirect to={`/search/movie?query=${valueInput}`} /> : null}
    </>
  )
}

export default Jumbotron