import React from 'react'
import { useEffect, useState, useRef } from 'react'

import { Link, Outlet } from 'react-router-dom'
import  '../../Css/Css1.css'
export default function NavBar({color}) {

  return (
    <>

        <div className='navbar second'>
            
            <div className="nav-items second">
              <div style={{color : `${color}`}} className='box1'>
                <div className='title'><Link to="/"><div>Home</div></Link></div>
              </div>
              <div style={{color : `${color}`}} className='box1'>
                <div className='title'><Link to="/House"><div>Dashboard</div></Link></div>
              </div>
              <div style={{color : `${color}`}} className='box1'>
                <div className='title'><Link to="/hotel"><div>Hotels</div></Link></div>
              </div>
              <div style={{color : `${color}`}} className='box1'>
                <div className='title'><Link to="/search"><div>Search</div></Link></div>
              </div>
            </div>
        </div>
      <Outlet></Outlet>
    </>
  )
}