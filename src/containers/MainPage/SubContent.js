import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames';

import Menu from './Menu'
import MovieContainer from './MovieContainer'
import './Subcontent.css'

const SubContent = ({ tagline, lists, stylingType }) => {
  const movies = useSelector(state => state.trendingToday)

  //States
  const [isListClicked, setIsListClicked] = useState(false)
  const [menuType, setMenuType] = useState(lists[0])

  //Handlers
  const anchorClickHandler = (type) => {
    setMenuType(type)
    setIsListClicked(!isListClicked)
  }

  //CSS Classes
  const classHandler = (type) => classNames({
    'anchor': true,
    'selected': type === menuType,
    'hide': type !== menuType && !isListClicked
  })

  return (
    <div className={`wrapper-background-${stylingType}`}>
      <div className={`wrapper wrapper-style-${stylingType}`}>
        <h1>{tagline}</h1>
        <Menu
          tagline = {tagline}
          stylingType={stylingType}
          clickHandler={anchorClickHandler}
          classHandler={classHandler}
          lists={lists} />
      </div>
      { movies ? <MovieContainer stylingType={stylingType} tagline={tagline} category={menuType}></MovieContainer> : null}
    </div>
  )
}

export default SubContent