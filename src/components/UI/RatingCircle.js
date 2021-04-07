import React from 'react'
import './RatingCircle.css'

const RatingCircle = ({ rating }) => {
  const styleRating = rating > 70 ? 'rating-style-1' 
  : rating > 40 ? 'rating-style-2' 
  : rating === 0 ? 'rating-style-4' 
  : 'rating-style-3'

  return (
    <div className="wrapper-rating">
      <div className="outer">
        <div className="inner-1">
          {rating === 0 ?
            <p>NR</p> :
            <p>{rating}<sup>%</sup></p>
          }
        </div>
        <div className={`inner-2 ${styleRating} `}></div>
      </div>
    </div>
  )
}

export default RatingCircle