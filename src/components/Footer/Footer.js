import React from 'react'
import './Footer.css'
import tmdbLogo from '../../assets/tmdb-logo-footer.svg'

const Footer = () => {
  return (
    <footer>
      <div className="wrapper-footer-all">
        <img alt='tmdb-footer-logo' src={tmdbLogo}></img>
        <div className="wrapper-footer">
          <h2>THE MOVIE DB CLONE</h2>
          <p>Created by: Kent Nathaniel</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer