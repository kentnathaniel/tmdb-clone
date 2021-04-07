import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link } from 'react-router-dom'
import './NavContent.css'
import * as actions from '../store/actions/mainPage'

const NavContent = ({ title, path, dropdown, type }) => {
  //States
  const [showContent, setShowContent] = useState(false)

  //Dispatches
  const dispatch = useDispatch()

  //Handlers
  const mouseEnterHandler = () => {
    setShowContent(true)
  }

  const mouseLeaveHandler = () => {
    setShowContent(false)
  }

  const clickHandler = (e) => {
    e.preventDefault()
    setShowContent(!showContent)
  }

  let dropdownRendered = null

  if (type === 1) {
    dropdownRendered = (
      <NavDropdown id='no-caret'
        show={showContent}
        onMouseEnter={() => mouseEnterHandler()}
        onMouseLeave={() => mouseLeaveHandler()}
        title={title}>
        {dropdown.map(dropContent => (
          <Link
            onClick={() => {
              dispatch(actions.fadePage())
              dispatch(actions.clearFilteredMovies())
            }}
            className='dropdown-item'
            key={'_' + Math.random().toString(36).substr(2, 9)}
            to={`/${path}${dropContent.path}`}> {dropContent.tagline} </Link>
        ))}
      </NavDropdown>)
  } else {
    const hideClass = showContent ? null : `hide-content`
    dropdownRendered = (
      <nav className='sidebar-dropdown'>
        <h1
          onClick={clickHandler}
          className='title'
          href='/'>{title}</h1>
        <ul className={hideClass}>
          {dropdown.map(dropContent => (
            <li key={'_' + Math.random().toString(36).substr(2, 9)}>
              <Link
                onClick={() => {
                  dispatch(actions.showSidebar())
                  dispatch(actions.fadePage())
                  dispatch(actions.clearFilteredMovies())
                }}
                to={`/${path}${dropContent.path}`}>
                {dropContent.tagline}</Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <>
      {dropdownRendered}
    </>
  )

}

export default NavContent