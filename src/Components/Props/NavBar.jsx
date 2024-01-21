import React from 'react'
import { useEffect, useState, useRef } from 'react'

import { Link, Outlet } from 'react-router-dom'
export default function NavBar({color}) {
  
  useEffect(() => {
  },[])
  function handlenav(){
    let navItems = document.querySelector('.nav-items')
    let displayValue = getComputedStyle(navItems).display
    if( displayValue == 'flex'){
      navItems.style.display = 'none'
      return
    }
    navItems.style.display = 'flex'
  }
  return (
    <>

        <div className='navbar'>
            
            <div className="nav-items">
              <div style={{color : `${color}`}} className='box1'>
                <div className='title'><Link to="/"><div>Home</div></Link></div>
              </div>
              <div style={{color : `${color}`}} className='box1'>
                <div className='title'><Link to="/Hotel/1"><div>Overview</div></Link></div>
              </div>
              <div style={{color : `${color}`}} className='box1'>
                <div className='title'><Link to="/Search"><div>Hotels</div></Link></div>
              </div>
              <div style={{color : `${color}`}} className='box1'>
                <div className='title'><Link to="/Checkout/1"><div>Checkout</div></Link></div>
              </div>
            </div>
            <div onClick={handlenav} className="burger-nav">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7H19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 17H19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
        </div>
      <Outlet></Outlet>
    </>
  )
}