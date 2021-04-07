import React, { useCallback, } from 'react'
import { useSelector } from 'react-redux'
import Movie from '../../components/Movie'
import 'swiper/swiper.min.css';
import './MovieContainer.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { trackWindowScroll } from 'react-lazy-load-image-component'

const MovieContainer = ({ tagline, category, stylingType, scrollPosition }) => {
  //States - Redux
  const popularTV = useSelector(state => state.popularTV)
  const popularMovies = useSelector(state => state.popularMovies)
  const trailerTV = useSelector(state => state.trailerTV)
  const trailerMovies = useSelector(state => state.trailerMovies)
  const trendingToday = useSelector(state => state.trendingToday)
  const trendingWeek = useSelector(state => state.trendingWeek)

  const categoryPopular = useSelector(state => state.categoryPopular)
  const categoryTrailer = useSelector(state => state.categoryTrailer)
  const categoryTrending = useSelector(state => state.categoryTrending)

  let renderedResult = null

  const movieRender = useCallback((movie) => {
    return (
      movie.map((
        { id, poster_path, backdrop, name, title,
          media_type, release_date, video_title,
          first_air_date, vote_average, video_url }) => {
        let date = new Date(release_date || first_air_date)
        return (
          <SwiperSlide
            key={'_' + Math.random().toString(36).substr(2, 9)}
            className={`swiper-slide-style-${stylingType}`}>
            <Movie
              stylingType={stylingType}
              key={id}
              id={id}
              poster_path={poster_path || backdrop}
              title={name || title}
              media={media_type}
              video_title={video_title}
              video_url={video_url}
              date={date}
              rating={parseFloat(vote_average) * 10}
              scrollPosition={scrollPosition}
            >
            </Movie>
          </SwiperSlide>
        )
      })
    )
  }, [scrollPosition, stylingType])

  if (tagline === "What's Popular") {
    if (categoryPopular === 'On Tv' && popularTV) {
      renderedResult = movieRender(popularTV)
    } else if (categoryPopular === 'In Theaters' && popularMovies) {
      renderedResult = movieRender(popularMovies)
    }
  }
  else if (tagline === "Latest Trailers") {
    if (categoryTrailer === 'On Tv' && trailerTV) {
      renderedResult = movieRender(trailerTV)
    } else if (categoryTrailer === 'In Theaters' && trailerMovies) {
      renderedResult = movieRender(trailerMovies)
    }
  } else if (tagline === "Trending") {
    if (categoryTrending === 'Today' && trendingToday) {
      renderedResult = movieRender(trendingToday)
    } else if (categoryTrending === 'This week' && trendingWeek) {
      renderedResult = movieRender(trendingWeek)
    }
  }

  return (
    <>
      <Swiper
        slidesPerView={'auto'}
      >
        {renderedResult}
      </Swiper>
    </>
  )
}

export default trackWindowScroll(MovieContainer)