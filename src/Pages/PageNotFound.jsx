import React from 'react'
import { Link } from 'react-router-dom'

export default function PageNotFound() {
  return (
    <>
        <div className="page-not-found-container">
            <div className="page-not-found-title">Page Not Found</div>
            <div className="page-not-found-description">Oops! It seems you've taken a wrong turn. The page you're looking for is on a coffee break. Let's redirect you back to reality.</div>
            <Link to={'/'}>
            <div className="page-not-found-redirect">Back to Home</div>
            </Link>
        </div>
    </>
  )
}
