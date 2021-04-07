import React from 'react'
import './Sidebar.css'
import Navigation from '../../components/Navigation'

const Sidebar = ({show}) => {
  const isShowSidebar = show ? `show-sidebar` : null

  return (
    <div className={`sidebar ${isShowSidebar}`}>
      <Navigation type={2}/>
    </div>
  )
}

export default Sidebar