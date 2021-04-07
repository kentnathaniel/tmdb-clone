import React from 'react'
import NavContent from './NavContent'

const navContents = [
  {
    title: 'Movies',
    path: 'movie',
    dropdown: [
      {
        path: '',
        tagline: 'Popular'
      },
      {
        path: '/now-playing',
        tagline: 'Now Playing'
      },
      {
        path: '/upcoming',
        tagline: 'Upcoming'
      },
      {
        path: '/top-rated',
        tagline: 'Top Rated'
      }]
  },
  {
    title: 'Tv Shows',
    path: 'tv',
    dropdown: [
      {
        path: '',
        tagline: 'Popular'
      },
      {
        path: '/airing-today',
        tagline: 'Airing Today'
      },
      {
        path: '/on-the-air',
        tagline: 'On Tv'
      },
      {
        path: '/top-rated',
        tagline: 'Top Rated'
      }]
  },
  {
    title: 'People',
    path: 'person',
    dropdown: [{
      path: '',
      tagline: 'Popular People'
    }]
  }
]

const Navigation = (props) => (
  <nav>
    <ul>
      {navContents.map(navContent => {
        return (<NavContent
          key={'_' + Math.random().toString(36).substr(2, 9)} 
          type={props.type}
          path={navContent.path} 
          title={navContent.title} 
          dropdown={navContent.dropdown}></NavContent>)
      })}
    </ul>
  </nav>
)

export default Navigation