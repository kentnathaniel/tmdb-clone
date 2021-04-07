import './App.css';

import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from './store/actions/mainPage'
import { Route, Switch, Redirect } from 'react-router-dom'

import MainPage from './containers/MainPage/MainPage'
import MovieInfo from './containers/MovieInfo/MovieInfo'
import PeopleInfo from './containers/PeopleInfo/PeopleInfo'
import PeopleList from './containers/PeopleList/PeopleList'
import MovieList from './containers/MovieList/MovieList'
import SearchPage from './containers/SearchPage/SearchPage'

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer'
import Sidebar from './components/SideBar/Sidebar'
import YoutubeModal from './components/Modal/YoutubeModal'

const App = () => {
  //States
  const showYT = useSelector(state => state.showYTModal)
  const showSidebar = useSelector(state => state.showSidebar)
  const fading = useSelector(state => {
    return state.fading ? 'fading' : null
  })


  //Dispatches
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.fetchInit())
    dispatch(actions.fadePage())
  }, [dispatch])

  //Handlers
  const hamburgerHandler = () => {
    dispatch(actions.showSidebar())
  }

  const hideYTHandler = useCallback(() => {
    dispatch(actions.showYoutubeModal())
  }, [dispatch])

  const idRegex = '([0-9]+.*)'
  const movieCategory = '(now-playing|upcoming|top-rated)'
  const tvCategory = '(airing-today|on-the-air|top-rated)'

  return (
    <>
      <Header hamburgerHandler={hamburgerHandler} />
      <Sidebar show={showSidebar} />
      <div className={`main-container ${fading}`} onAnimationEnd={() => dispatch(actions.fadePage())}>
        <Switch>
          <Route path={`/person/:id${idRegex}`} component={PeopleInfo} />
          <Route path={`/:genre(tv|movie)/:id${idRegex}`} component={MovieInfo} />
          <Route path={`/:genre(movie)/:category${movieCategory}`} component={MovieList} />
          <Route path={`/:genre(tv)/:category${tvCategory}`} component={MovieList} />
          <Route path='/:genre(movie|tv)' exact component={MovieList} />
          <Route path='/search/:type(tv|person|movie|company|keyword|collection)' component={SearchPage} />
          <Route path='/person' exact component={PeopleList} />
          <Route path='/' exact component={MainPage} />
          <Redirect to='/' />
        </Switch>
      </div>
      <YoutubeModal show={showYT} onHide={() => hideYTHandler()} />
      <Footer />
    </>
  );
}

export default App;
