import React, { } from 'react'
import { useDispatch } from 'react-redux'
import './Menu.css'
import * as actions from '../..//store/actions/mainPage'


const Menu = ({ tagline, classHandler, lists, clickHandler, stylingType }) => {
  //Dispatches
  const dispatch = useDispatch()

  const listClickHandler = (list) => {
    clickHandler(list)
    if (tagline === "What's Popular") {
      dispatch(actions.changeCategoryPopular(list))
    } else if (tagline === "Latest Trailers") {
      dispatch(actions.changeCategoryTrailer(list))
    } else if (tagline === "Trending") {
      dispatch(actions.changeCategoryTrending(list))
    }
  }

  return (
    <div className='selector-wrapper'>
      <div className={`selector selector-style-${stylingType}`}>
        {lists.map(list => (
          <div
            key={'_' + Math.random().toString(36).substr(2, 9)}
            className={classHandler(list)}
            onClick={() => {
              listClickHandler(list)
            }}>
            <h3 className=''>
              {list}
            </h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu