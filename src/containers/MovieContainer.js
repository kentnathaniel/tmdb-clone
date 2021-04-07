import React from 'react'
import Movie from '../components/Movie'
import './MovieContainer.css'

const MovieContainer = ({ movies, stylingType }) => {
  return (movies.map(({ id,
    poster_path, backdrop, name, title,
    media_type, release_date, video_title,
    first_air_date, vote_average, video_url, overview }) => {

    let date = (release_date !== '' && release_date) || (first_air_date !== '' && first_air_date) ?
      new Date(release_date || first_air_date)
      : 'no-date'
    return (
      <div
        key={'_' + Math.random().toString(36).substr(2, 9)}
        className='style-card'>
        <Movie
          id={id}
          media_type={media_type}
          stylingType={stylingType || 4}
          poster_path={poster_path || backdrop}
          title={name || title}
          media={media_type}
          video_title={video_title}
          video_url={video_url}
          date={date}
          rating={parseFloat(vote_average) * 10}
          overview={overview}
        // scrollPosition={scrollPosition}
        >
        </Movie>
      </div>
    )
  }))
}

export default MovieContainer