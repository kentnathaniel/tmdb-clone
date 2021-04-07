import React, {useState} from 'react'
import './SearchBar.css'

const SearchBar = props => {
  const [searchKeyword, setSearchKeyword] = useState('')

  const searchHandler = (event) => {
    event.preventDefault()
    props.searchRequest(searchKeyword)
  }
  
  const inputHandler = (event) => {
    setSearchKeyword(event.target.value)
  }
  
  return (
    <div className='searchbar-jumbotron'>
      <form onSubmit={searchHandler}>
        <input type="text" placeholder="Search" onChange={e => inputHandler(e)} value={searchKeyword} />
        <button>Search</button>
      </form>
    </div>
  )
}

export default SearchBar