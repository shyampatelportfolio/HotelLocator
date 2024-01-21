import React, { useEffect } from 'react'
import Stars from './Stars'
export default function ReviewCard({review}) {

 
  function adjustDates(date){
    const lastTwo = Number(date.slice(-2)) + 2
    const altLastTwo = date.slice(0,-2)
    const newDate = altLastTwo + `${lastTwo}`
    return newDate  
  }
  return (
    <> 
        <div className="person-review-card">
            <div className="person-review-card-name">{review.personName}</div>
            <div className="person-review-card-rating">
                <Stars rating={review.rating} width={11}></Stars>
            </div>
            <div className="person-review-card-title">{review.reviewTitle}</div>
            <div className="person-review-card-description">
              {review.reviewDescription}
            </div>
            <div className="person-review-card-date">{adjustDates(review.date)}</div>
        </div>
    </>
  )
}
