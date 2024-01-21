import React from 'react'
import { useState, useEffect } from 'react'
import HotelInformationData from '../../Data/Hotels.json'
export default function HotelInformation() {
    const [selection, setselection] = useState("Cleaning")
    useEffect(() => {
        
        
        
        let scrollbarContainer = document.querySelector('.hotel-content-body-scroller')
        let textBody = document.querySelector('.hotel-content-body-wrapper')
        let carousel = document.querySelector('.hotel-content-body-carousel')
        let height1 = carousel.scrollHeight
        let height2 = Number(getComputedStyle(textBody).height.slice(0,-2))

        // scrollbarContainer.style.width = `${height2}px`
        // scrollbarContainer.style.right = `-${height2 - 0.007*window.innerWidth}px`


        textBody.addEventListener('wheel', handleHotelText)
        function handleHotelText(e){
            e.preventDefault()
            let nextPercentage
            if(e.deltaY < 0){
                if(carousel.dataset.scroll < 0) {
                    nextPercentage = height2 + parseFloat(carousel.dataset.scroll)
                    textBody.dataset.defer = 0
                }else{
                    textBody.dataset.defer = parseFloat(textBody.dataset.defer) + 1
                    nextPercentage = carousel.dataset.scroll
                }
            }else{
                if(carousel.dataset.scroll > -height1 + height2) {
                    textBody.dataset.defer = 0
                    nextPercentage = -height2 + parseFloat(carousel.dataset.scroll)
                }else{
                    nextPercentage = carousel.dataset.scroll
                    textBody.dataset.defer = parseFloat(textBody.dataset.defer) + 1
                }
            }
            carousel.dataset.scroll = nextPercentage
            carousel.style.transform = `translateY(${nextPercentage}px)`
        }
        return () => {
            textBody.removeEventListener('wheel', handleHotelText);
            carousel.style.transform = `translateY(0px)`
            carousel.dataset.scroll = 0
            textBody.dataset.defer = 0
          }

    }, [selection])
    function changeselection(e){
        const items = document.querySelectorAll('.hotel-nav-item')
        items.forEach(x => x.classList.remove('selected'))
        e.target.className += ' selected'
        setselection(e.target.dataset.val)
        const background = document.querySelector('.hotel-content-svg')
        background.style.transform = `translateY(-${e.target.dataset.number*20}%)`
    }

  return (
    <>
        <div className="section">
            <div className="hotel-content-container">
                <div className="hotel-content-title">Hotel Information</div>
                <div className="hotel-content-body">
                        
                    <div className="hotel-content-svg">

                        <img src="/Images/HotelInformation/Cleaning.jpg" alt="" />
                        <img src="/Images/HotelInformation/PropertyAmenities.jpg" alt="" />
                        <img src="/Images/HotelInformation/RoomAmenities.jpg" alt="" />
                        <img src="/Images/HotelInformation/Policies.jpg" alt="" />
                        <img src="/Images/HotelInformation/ImportantInformation.jpg" alt="" />

                    </div>
                    <div className="hotel-content-svg-background">
                    </div>
                    <div className="hotel-content-body-wrapper" data-defer="0">
                        {/* <div className="hotel-content-body-scroller">
                            <input onChange={(e) => handleScroll(e)} defaultValue={0} type="range" className='apple-scrollbar' />
                        </div> */}
                        <div className="hotel-content-body-carousel" data-scroll="0">

                            {HotelInformationData && HotelInformationData.information[`${selection}`].map((x,i) => {
                                return (
                                <div key={i}>
                                    <div className="hotel-content-body-title">{Object.keys(x)[0]}</div>
                                    <div className="hotel-content-body-text">
                                    {Object.values(x)[0].map((y,j) => {
                                        return <div key={j} className="hotel-content-body-text-item">{y}</div>
                                    })}
                                    </div>
                                </div>
                                )
                            })} 
                        </div>
                    </div>
                    
                </div>

                <div className="hotel-content-nav">
                    <div onClick={(e) => changeselection(e)} data-number="0" data-val="Cleaning" className="hotel-nav-item selected">Cleaning and Safety</div>
                    <div onClick={(e) => changeselection(e)} data-number="1" data-val="PropertyAmenities" className="hotel-nav-item">Property Amenities</div>
                    <div onClick={(e) => changeselection(e)} data-number="2" data-val="RoomAmenities" className="hotel-nav-item">Room Amenities</div>
                    <div onClick={(e) => changeselection(e)} data-number="3" data-val="Policies" className="hotel-nav-item">Policies</div>
                    <div onClick={(e) => changeselection(e)} data-number="4" data-val="ImportantInformation" className="hotel-nav-item">Important Information</div>           
                </div>
            </div>
        </div>
    </>
  )
}
                

