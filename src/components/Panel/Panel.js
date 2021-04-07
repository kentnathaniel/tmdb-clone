import React, { useEffect, useState, useContext } from 'react'
import { useDispatch } from 'react-redux'
import * as actions from '../../store/actions/mainPage'
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown'
import { DropdownButton } from 'react-bootstrap'
import './Panel.css'

const BASE_URL = 'https://api.themoviedb.org/3'

const sortMenus = [
  {
    menu: 'Popularity Descending',
    sort: 'popularity.desc'
  },
  {
    menu: 'Popularity Ascending',
    sort: 'popularity.asc'
  },
  {
    menu: 'Rating Descending',
    sort: 'vote_average.desc'
  },
  {
    menu: 'Rating Ascending',
    sort: 'vote_average.asc'
  },
  {
    menu: 'Release Date Descending',
    sort: 'release_date.desc'
  },
  {
    menu: 'Release Date Ascending',
    sort: 'release_date.asc'
  },
  {
    menu: 'Title(A-Z)',
    sort: 'original_title.asc'
  }, {
    menu: 'Title(Z-A)',
    sort: 'original_title.desc'
  }
]

const fetchGenres = async () => {
  const { data } = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: {
      api_key: '79ff1b0d338aa1ba767e1c7c2f1240e6'
    }
  })
  return data.genres
}

const Genre = ({ genre }) => {
  const panelContext = useContext(PanelContext)

  let isSelected = false

  if (panelContext.selectedGenres.findIndex(selectedGenre => selectedGenre.name === genre.name) >= 0) {
    isSelected = true
  }

  return (
    <li
      className={`${isSelected ? 'selected-genre' : null}`}
      onClick={() => panelContext.genreHandler(genre)}>
      {genre.name}
    </li>
  )

}

const PanelContext = React.createContext({
  selectedGenres: [],
  genreHandler: () => { }
})

const Panel = ({ type }) => {
  const [searchDisabled, setSearchDisabled] = useState(true)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedSortMenu, setSelectedSortMenu] = useState(sortMenus[0])
  const [sortShow, setSortShow] = useState(false)
  const [filtersShow, setFiltersShow] = useState(false)
  const [genres, setGenres] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    async function sideEffect() {
      setGenres(await fetchGenres())
    }

    sideEffect()
  }, [])

  let hideSort = 'hide-content'
  if (sortShow) {
    hideSort = ''
  }

  let hideFilter = 'hide-content'
  if (filtersShow) {
    hideFilter = ''
  }

  const sortMenuHandler = (menu) => {
    setSearchDisabled(false)
    setSelectedSortMenu(menu)
  }

  const genreHandler = (newSelected) => {
    const idx = selectedGenres.length > 0 ?
      selectedGenres.findIndex(selectedGenre => selectedGenre.name === newSelected.name) : -1

    let newSelectedGenres = null

    if (idx === -1) {
      newSelectedGenres = selectedGenres.concat([newSelected])
    } else {
      newSelectedGenres = selectedGenres.slice(0, idx).concat(selectedGenres.slice(idx + 1))
    }

    setSelectedGenres(newSelectedGenres)
  }

  return (
    <PanelContext.Provider
      value={{
        selectedGenres: selectedGenres,
        genreHandler: genreHandler
      }}
    >
      <div className='panel-wrapper'>
        <div className='panel-content'>
          <div onClick={() => setSortShow(!sortShow)} className='panel-title'>
            <h2> Sort </h2>
            <span className='arrow-right'></span>
          </div>
          <div className={'panel-dropdown ' + hideSort}>
            <div className='panel-dropdown-content'>
              <h2> Sort Results By </h2>
              <Dropdown>
                <DropdownButton title={selectedSortMenu.menu} variant="secondary" id="dropdown-basic">
                  {
                    sortMenus.map(sortMenu => <Dropdown.Item
                      key={'_' + Math.random().toString(36).substr(2, 9)}
                      onClick={() => sortMenuHandler(sortMenu)}>{sortMenu.menu}</Dropdown.Item>)
                  }
                </DropdownButton>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className='panel-content'>
          <div onClick={() => setFiltersShow(!filtersShow)} className='panel-title'>
            <h2> Filters </h2>
            <span className='arrow-right'></span>
          </div>
          <div className={'panel-dropdown ' + hideFilter}>
            <div className='panel-dropdown-content'>
              <h2>Genres </h2>
              <ul>
                {genres ?
                  genres.map(genre => {
                    return <Genre
                      key={'_' + Math.random().toString(36).substr(2, 9)}
                      genre={genre}></Genre>
                  }) : null}
              </ul>
            </div>
          </div>
        </div>

        <button
          className='search-button' onClick={() => { dispatch(actions.fetchFilteredMovies(selectedSortMenu.sort, selectedGenres, type)) }} disabled={searchDisabled}>
          Search
      </button>
      </div>
    </PanelContext.Provider>
  )
}

export default Panel