import React from 'react'
import ScrollCard from '../Props/ScrollCard'
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


export default function HotelRoomGallery({id}) {



    const {data : galleryData, status, isLoading, refetch } = useQuery({
        queryKey : ['galleryData', id],
        queryFn : () => fetchGalleryData(id),
    })


    const [test, setTest] = useState(false)
    const [lastClick, setLastClick] = useState(0)
    const [galleryRoom, setGalleryRoom] = useState(null)
    const navigate = useNavigate();


  

    useEffect(() => {
        if(!galleryRoom) return
        let items = document.querySelectorAll('.hotel-room-gallery-carousel-image')
        items.forEach((x,i) => {
            x.style.setProperty("--item-index", `${100*i}%`)
        })
    }, [galleryRoom])


    useEffect(() => {
        if(!galleryData) return
        setGalleryRoom(galleryData[0])
        let galleryContainer = document.querySelector('.hotel-room-gallery-wrapper')
        galleryContainer.addEventListener('mouseenter', start, {once:true})
    }, [galleryData])






   async function fetchGalleryData(hotelId){
        let url = `${import.meta.env.VITE_APP_API_BASE_URL}/FindHotels/GalleryPage?hotelId=${hotelId}`
        const response = await axios.post(url)
        const hotelData = response.data
        return hotelData
      }


    function handletest(){
        
        let currentTime = new Date().getTime();
        if (currentTime - lastClick < 4500) {
            console.log('stopped')
            return
        }
        setLastClick(currentTime)
        if(!test){
            start()
            return
        }
        stop()
    }

    function start(){
        setTest(true)
        let selectionContainer = document.querySelector('.hotel-room-selection')
        let selectionTitle = document.querySelector('.selection-title')
        let scroller = document.querySelector('.hotel-room-scroller')
        let galleryRoomContainer = document.querySelector('.hotel-room-gallery-container')

        selectionContainer.style.opacity = '100%'
        selectionContainer.style.zIndex = 3
        galleryRoomContainer.style.filter = 'blur(30px)'

        setTimeout(() => {
            selectionTitle.className += ' start'
            scroller.className += ' start'
            selectionTitle.style.opacity = '100%'
        }, 1000);

        setTimeout(() => {
            selectionTitle.style.top = '15vh'
            selectionTitle.style.transform = 'scale(50%)'
            scroller.style.opacity = '100%'
        }, 2000);
    }
    function stop(){
        setTest(false)
        let selectionContainer = document.querySelector('.hotel-room-selection')
        let selectionTitle = document.querySelector('.selection-title')
        let scroller = document.querySelector('.hotel-room-scroller')
        let galleryRoomContainer = document.querySelector('.hotel-room-gallery-container')

        selectionTitle.style.opacity = '0%'
        scroller.style.opacity = '0%'

        setTimeout(() => {
            selectionTitle.classList.remove('start')
            scroller.classList.remove('start')
            selectionTitle.style.top = '30vh'
            selectionTitle.style.transform = 'scale(100%)'
        }, 2000);

        setTimeout(() => {
            selectionContainer.style.zIndex = 1
            selectionContainer.style.opacity = '0%'
            galleryRoomContainer.style.filter = 'blur(0px)'
        }, 1500);

    }
    function changegalleryroom(roomId){
        handletest()

        const myGalleryRoom = galleryData.filter((x) => {
            return x.roomId == roomId
        })
        console.log(myGalleryRoom)
        setGalleryRoom(myGalleryRoom[0])


        let body = document.querySelector('.hotel-room-gallery-body')
        let bodyWrapper = document.querySelector('.hotel-room-gallery-body-wrapper')
            
        bodyWrapper.style.top = '0'
        bodyWrapper.classList.remove('trans')
        body.classList.remove('animate')

        setTimeout(() => {
            bodyWrapper.className += ' trans'
            bodyWrapper.style.top = '-100%'
        }, 1000);
        setTimeout(() => {
            
            body.className += ' animate'
        }, 2500);
    }
    function handleInfoSwipe(){
        const downChevron = document.querySelector('.down-chevron')
        const sideChevrons = [...document.querySelectorAll('.side-chevron')]
        console.log(sideChevrons)
        let body = document.querySelector('.hotel-room-gallery-body')
        let bodyWrapper = document.querySelector('.hotel-room-gallery-body-wrapper')
        let originalPosition = Number(getComputedStyle(bodyWrapper).top.slice(0,-2))
        if( originalPosition < -1){
            bodyWrapper.style.top = '0'
            body.classList.remove('animate')
            downChevron.style.transform = 'rotate(0deg)'
            sideChevrons.forEach(x => {
                x.style.opacity = 1
            })
            return
        }
        bodyWrapper.style.top = '-100%'
        body.className += ' animate'
        downChevron.style.transform = 'rotate(180deg)'
        sideChevrons.forEach(x => {
            x.style.opacity = 0
        })

    }
    function handleSwipeLeft(){
        let items = document.querySelectorAll('.hotel-room-gallery-carousel-image')
        let count = items.length
        if(count < 2) return

        items.forEach(x => {
            let int1 = Number(getComputedStyle(x).getPropertyValue("--item-index").slice(0,-1))
            if(int1 == -100){
                x.classList.remove('animate')
                int1 = (count-1)*100
                x.style.setProperty("--item-index", `${int1}%`)
                setTimeout(() => {
                    x.className += ' animate'
                    x.style.setProperty("--item-index", `${int1 -100}%`)
                }, 10)

                return
            }
            x.style.setProperty("--item-index", `${int1 -100}%`)
        })
    }
    function handleSwipeRight(){
        let items = document.querySelectorAll('.hotel-room-gallery-carousel-image')
        let count = items.length
        if(count < 2) return

        items.forEach(x => {
            let int1 = Number(getComputedStyle(x).getPropertyValue("--item-index").slice(0,-1))
            if(int1 == (count-1)*100){
                x.classList.remove('animate')
                int1 = -100
                x.style.setProperty("--item-index", `${int1}%`)
                setTimeout(() => {
                    x.className += ' animate'
                    x.style.setProperty("--item-index", `${int1 +100}%`)
                }, 10)

                return
            }
            x.style.setProperty("--item-index", `${int1 +100}%`)
        })
    }
    function handleCheckout(galleryRoomId){
        navigate(`/Checkout/${galleryRoomId}`);
    }
  return (
    <>
        <div className="section">
            {!isLoading && 
                <div className="hotel-room-gallery-wrapper">
                    <div className="hotel-room-gallery-container">
                        <div className="hotel-room-gallery-image">
                            <div className="hotel-room-gallery-carousel">
                                {galleryRoom && galleryRoom.images.map((x,i) => {
                                    return <img key={i} className='hotel-room-gallery-carousel-image animate' src={x}></img>
                                })}
                            </div>
                            <div className="hotel-room-gallery-body-wrapper trans">
                                <div className="hotel-room-gallery-body-space">
                                </div>
                                <div className="hotel-room-gallery-body animate">
                                
                                    
                                    
                                    {galleryRoom &&
                                    
                                    <div className="body-wrapper">
                                        <div className="hotel-room-gallery-body-title">{galleryRoom.roomTitle}</div>
                                        <div className="hotel-room-gallery-body-description">
                                            {galleryRoom.roomDescription}
                                        </div>
                                        <div className="hotel-room-gallery-body-amenities-container">
                                            <div className="hotel-room-gallery-body-amenities obj1">
                                                <div className="hotel-room-gallery-body-amenities-title">{galleryRoom.details.bedrooms}</div>
                                                <div className="hotel-room-gallery-body-amenities-description">Bedrooms</div>
                                            </div>
                                            <div className="hotel-room-gallery-body-amenities obj2">
                                                <div className="hotel-room-gallery-body-amenities-title">{galleryRoom.details.bathrooms}</div>
                                                <div className="hotel-room-gallery-body-amenities-description">Bathrooms</div>
                                            </div>
                                            <div className="hotel-room-gallery-body-amenities obj3">
                                                <div className="hotel-room-gallery-body-amenities-title">{galleryRoom.details.size}</div>
                                                <div className="hotel-room-gallery-body-amenities-description">meters space</div>
                                            </div>
                                        </div>
                                        <div className="hotel-room-gallery-body-price-container">
                                            <div className="hotel-room-gallery-body-price">
                                                £{galleryRoom.price}
                                                <div className="hotel-room-gallery-body-price-pernight">/night</div>
                                            </div>
                                            <div onClick={() => handleCheckout(galleryRoom.roomId)} className="hotel-room-gallery-body-price-button">
                                                Book Now
                                                <span className='span1'></span>
                                                <span className='span2'></span>
                                                <span className='span3'></span>
                                                <span className='span4'></span>
                                                <span className='span1 second'></span>
                                                <span className='span2 second'></span>
                                                <span className='span3 second'></span>
                                                <span className='span4 second'></span>
                                                {/* <div className="hotel-room-gallery-body-price-button-background">
            
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
        
                        <div onClick={handletest} className="hotel-room-gallery-button">
                            Change room
                        </div>
                        <div className="hotel-room-gallery-carousel-buttons">
                                    <div onClick={handleSwipeRight} className="left-chevron side-chevron">
                                    </div>
                                    <div onClick={handleSwipeLeft} className="right-chevron side-chevron">
                                    </div>
                                    <div onClick={handleInfoSwipe} className="down-chevron">
                                    </div>
                        </div>
                    </div>
                    <div className="hotel-room-selection">
                        <div className="selection-title noselect">Select a Room</div>
                        <div  className="hotel-room-scroller">
                            <ScrollCard changegalleryroom={changegalleryroom} rooms={galleryData}></ScrollCard>
                        </div>
                        <div className="hotel-room-selection-tooltip-container">
                            
                        </div>
                    </div>
                </div>
            }
        </div>
    </>
  )
}