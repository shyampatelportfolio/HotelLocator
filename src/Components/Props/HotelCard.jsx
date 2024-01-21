import React, { useEffect, useRef } from 'react'
import Stars from './Stars'
export default function HotelCard({info, handleHotelCard}) {

  return (
    <>
        <div onClick={() => handleHotelCard(info.hotelId)} className="hotel-card">
          <div className="hotel-card-background selected" data-id={info.hotelId}></div>
          <div className="hotel-card-image">
              <img src={info.frontImage}></img>
            </div>
            <div className="hotel-card-information">
              <div className="hotel-card-header">
                {/* <div className='heart-svg'>
                  <svg width="89" height="79" viewBox="0 0 89 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className='hotel-card-heart' d="M63.9768 0.273682C55.9974 0.273682 48.8555 4.15321 44.4028 10.1048C39.9502 4.15321 32.8083 0.273682 24.8289 0.273682C11.2946 0.273682 0.317276 11.2951 0.317276 24.9175C0.317276 30.1637 1.1549 35.0133 2.60973 39.51C9.57525 61.5528 31.0449 74.7344 41.6695 78.3494C43.1684 78.8784 45.6372 78.8784 47.1362 78.3494C57.7608 74.7344 79.2304 61.5528 86.196 39.51C87.6508 35.0133 88.4884 30.1637 88.4884 24.9175C88.4884 11.2951 77.5111 0.273682 63.9768 0.273682Z" fill="#292D32"/>
                  </svg>
                </div> */}
               
                <div className="hotel-card-title">{info.hotelTitle}</div>
                <div className="hotel-card-subtitle-container">
                    <div> 
                      <svg width="103" height="138" viewBox="0 0 103 138" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='hotel-card-location' d="M51.8377 0C23.6265 0 0.675415 22.9603 0.675415 51.1826C0.675415 93.232 46.7452 134.29 48.7071 136.017C49.6014 136.805 50.7193 137.199 51.8377 137.199C52.9561 137.199 54.074 136.805 54.9688 136.017C56.9298 134.29 103 93.2325 103 51.1826C103 22.9603 80.049 0 51.8377 0ZM51.8377 125.969C41.6522 116.099 10.15 82.9939 10.15 51.1826C10.15 28.1849 28.8511 9.47458 51.8377 9.47458C74.8243 9.47458 93.5254 28.1849 93.5254 51.1826C93.5254 82.9934 62.0232 116.098 51.8377 125.969Z" fill="black"/>
                        <path className='hotel-card-location' d="M28.6517 51.1827C28.6517 38.3086 39.0563 27.8396 51.8377 27.8396C64.6191 27.8396 75.0237 38.3086 75.0237 51.1827C75.0237 64.0572 64.6192 74.5257 51.8377 74.5257C39.0563 74.5257 28.6517 64.0572 28.6517 51.1827ZM37.1258 51.1827C37.1258 59.3765 43.7199 66.0511 51.8377 66.0511C59.9555 66.0511 66.5496 59.3765 66.5496 51.1827C66.5496 42.9888 59.9555 36.3142 51.8377 36.3142C43.7199 36.3142 37.1258 42.9893 37.1258 51.1827Z" fill="black" stroke="black"/>
                      </svg>
                    </div>
                    <div className="hotel-card-subtitle">{info.hotelLocation}</div>
                  <div className="hotel-card-price-container">
                      <div className="hotel-card-price">£{info.filters.quantities.price}</div>
                      <div className='per-night'>/night</div> 
                  </div>
                </div>
                  
              </div>
              <div className="hotel-card-body">
                <div className="hotel-card-description-container">
                  <div className="hotel-card-description-title">Overview</div>
                  <div className="hotel-card-description">
                    {info.hotelDescription}
                  </div>
                </div>
                
                  <div className="hotel-card-details">
                    <div className="hotel-card-booking-button">Book Now</div>
                    
                    <Stars rating={info.filters.quantities.rating} width={12}></Stars>
                   
                  </div>
              </div>
            </div>
            
        </div>
    </>
  )
}
