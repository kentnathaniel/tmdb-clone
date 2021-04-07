import React from 'react'
import { useSelector } from 'react-redux'
import SubContent from './SubContent'
import Jumbotron from '../../components/Jumbotron/Jumbotron'
import './MainPage.css'

const mainContents = [
  {
    tagline: "What's Popular",
    menu: [
      'On Tv', 'In Theaters'
    ],
    stylingType: 1
  },
  {
    tagline: "Latest Trailers",
    menu: [
      'On Tv', 'In Theaters'
    ],
    stylingType: 2
  },
  {
    tagline: "Trending",
    menu: [
      'Today', 'This week'
    ],
    stylingType: 3
  }
]

const BASE_BACKGROUND_URL = 'https://themoviedb.org/t/p/w1920_and_h427_multi_faces'

const MainPage = () => {

  const backdropTrailerUrl = useSelector(state => state.backdropTrailerUrl)

  return (
    <>
      <Jumbotron />
      {mainContents.map(({ tagline, menu, stylingType }) => {
        let style = null

        if (stylingType === 2 && backdropTrailerUrl) {
          style = {
            backgroundImage: `url('${BASE_BACKGROUND_URL}/${backdropTrailerUrl}')`
          }
        }

        return (
          <div key={'_' + Math.random().toString(36).substr(2, 9)}>
            <div className={`display-container styling-${stylingType}`} style={style}>
              <SubContent stylingType={stylingType} tagline={tagline} lists={menu} />
            </div>
          </div>
        )
      })}
    </>
  )
}

export default MainPage