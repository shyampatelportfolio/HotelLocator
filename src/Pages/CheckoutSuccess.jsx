import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function CheckoutSuccess() {
  const navigate = useNavigate()
  useEffect(() => {
    setTimeout(() => {
      
      navigate('/')
    }, 3000);
  }, [])
  return (
    <>
    <div className="checkout-success-container">

      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="9" fill="#80E195"/>
        <path className='checkout-success-path' d="M5 9L8 12L13 6" strokeWidth="2"/>
      </svg>
      <div className="checkout-success-info">Payment Successful</div>
      <div className="checkout-success-return"><Link to="/"><div>Home</div></Link></div>
    </div>
    </>
  )
}
