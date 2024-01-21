import React from 'react'
import Stars from '../Props/Stars'
import { useEffect, useState, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function Page1({id}) {
    const [isShrunk, setIsShrunk] = useState(true)
    const [roomDisplay, setRoomDisplay] = useState([])


    const {data : overviewData, status, isLoading, refetch } = useQuery({
        queryKey : ['OverviewData', id],
        queryFn : () => fetchOverviewData(id),
    })




    useEffect(() => { 
        if(!overviewData) return
        const roomImages = []
        roomImages.push(overviewData.hotel.frontImage)
        overviewData.roomImages.forEach(x => {
            roomImages.push(x)
        })

        setRoomDisplay(roomImages)
  
        
    }, [overviewData])

    useEffect(() => {
        if(roomDisplay.length !== 0){
 
            setTimeout(() => {
                handleSwipe()
            }, 700);
            let items = document.querySelectorAll('.front-image-carousel-item')
            items.forEach((x,i) => {
                x.style.transform = `translateX(${x.dataset.position}%)`
            })
            let navItems = document.querySelectorAll('.navigation-image-wrapper')
            let navContainer = document.querySelector('.navigation-image-container')
            let total = navItems.length
            if(total > 5){
                navContainer.classList.remove('center')
                navItems.forEach((x,i) => {
                    x.className += ' absolute'
                    x.style.transform = `translateX(${x.dataset.position}%)`
                })
            }else{
                navContainer.className += ' center'
            }
            navItems[0].className += ' selected'
        }
    }, [roomDisplay])


    async function fetchOverviewData(hotelId){
        let url = `${import.meta.env.VITE_APP_API_BASE_URL}/FindHotels/OverviewPage?hotelId=${hotelId}`
        const response = await axios.post(url)
        const hotelData = response.data
        return hotelData
      }
    function handleSwipe(){
        let frontImage = document.querySelector('.front-image')
        let frontImageContainerBody = document.querySelector('.front-image-container-body')
        let frontImageTitle = document.querySelector('.front-image-container-title')
        if(isShrunk){
            frontImageTitle.classList.remove('movedown')
            setTimeout(() => {
                frontImage.classList.remove('move')
                frontImage.classList.remove('flash')
                frontImageContainerBody.classList.remove('fadeout')
                frontImageTitle.classList.remove('moveleft')
            }, 700)
            setIsShrunk(false)
        }
        else{
            frontImageTitle.className += ' moveleft'
            frontImage.className += ' move'
            frontImageContainerBody.className += ' fadeout'
            setIsShrunk(true)
            setTimeout(() => {
                frontImage.className += ' flash'
            },600)
            setTimeout(() => {
                frontImageTitle.className += ' movedown'
            },700)
        }
    }

    function handleMoveLeft(){
        let items = document.querySelectorAll('.front-image-carousel-item')
        let count = items.length
        if(count < 2) return
        items.forEach(x => {
            let int1 = x.dataset.position
            if(int1 == -100*(count - 1)){
                    x.classList.remove('animate')
                    int1 = 100
                    x.style.transform = `translateX(${int1}%)`
                    setTimeout(() => {
                        x.className += ' animate'
                        int1 += -100
                        x.style.transform = `translateX(${int1}%)`
                        x.dataset.position = 0
                    }, 10)
                    return
                }
            int1 = Number(int1) - 100
            x.dataset.position = int1
            x.style.transform = `translateX(${int1}%)`
        })
        handleMoveLeftNav()
    }
    function handleMoveRight(){
        let items = document.querySelectorAll('.front-image-carousel-item')
        let count = items.length
        if(count < 2) return
        items.forEach(x => {
            let int1 = x.dataset.position
            if(int1 == 100*(count - 1)){
                console.log(x, 100*(count - 1))
                    x.classList.remove('animate')
                    int1 = -100
                    x.style.transform = `translateX(${int1}%)`
                    setTimeout(() => {
                        x.className += ' animate'
                        int1 += 100
                        x.style.transform = `translateX(${int1}%)`
                        x.dataset.position = 0
                    }, 10)
                    return
                }
            int1 = Number(int1) + 100
            x.dataset.position = int1
            x.style.transform = `translateX(${int1}%)`
        })
        handleMoveRightNav()
    }
    function handleMoveLeftNav(){
        
        let navItems = document.querySelectorAll('.navigation-image-wrapper')
        let total = navItems.length

        let selectedItem = document.querySelector('.navigation-image-wrapper.selected')
        selectedItem.classList.remove('selected')
        let index = Number(selectedItem.dataset.position)
        if( total <= 5 && index == (total - 1)*100) {
            index = -100
        }
        let newSelectedItem = document.querySelector(`[data-position="${index + 100}"].navigation-image-wrapper`)
        newSelectedItem.className += ' selected'

        if(index % 500 == 400 && total >= 6){
            navItems.forEach((x,i) => {
                let position1 = Number(x.dataset.position)
                    if(position1 <= 400){
                        position1 += total*100
                        x.style.transform = `translateX(${position1}%)`
                        setTimeout(() => {
                            console.log('running')
                            x.className += ' animate'
                            position1 += -500
                            x.style.transform = `translateX(${position1}%)`
                            x.dataset.position = position1
                        }, 10)
                        setTimeout(() => {
                            x.classList.remove('animate')

                        }, 1000)
                        return
                    }
                x.className += ' animate'
                position1 += -500
                x.style.transform = `translateX(${position1}%)`
                x.dataset.position = position1
                setTimeout(() => {
                    x.classList.remove('animate')

                }, 1000)
            })
        }
    }
    function handleMoveRightNav(){
        let navItems = document.querySelectorAll('.navigation-image-wrapper')
        let total = navItems.length
        let selectedItem = document.querySelector('.navigation-image-wrapper.selected')
        selectedItem.classList.remove('selected')
        let index = Number(selectedItem.dataset.position)
        if( total <= 5 && index == 0) {
            index = 500
        }
        if( index == 0 ){
            index = total*100
        }
        let newSelectedItem = document.querySelector(`[data-position="${index - 100}"].navigation-image-wrapper`)
        newSelectedItem.className += ' selected'

        if(index == total*100 && total >= 6){
            navItems.forEach((x,i) => {
                let position1 = Number(x.dataset.position)
                    if(position1 >= (total-5)*100){
                        position1 += (total)*-100
                        x.style.transform = `translateX(${position1}%)`
                        setTimeout(() => {
                            x.className += ' animate'
                            position1 += 500
                            x.style.transform = `translateX(${position1}%)`
                            x.dataset.position = position1
                        }, 10)
                        setTimeout(() => {
                            x.classList.remove('animate')

                        }, 1000)
                        return
                    }
                position1 += 500
                x.style.transform = `translateX(${position1}%)`
                x.dataset.position = position1
            })
        }
    }
    function handleImage(e){
        let targetPosition = Number(e.target.closest('.navigation-image-wrapper').dataset.position)
        let originalPosition = Number(document.querySelector('.navigation-image-wrapper.selected').dataset.position)
        let difference = (targetPosition - originalPosition)/100

        if(difference == 0) return
        if(difference > 0){
            console.log(21321)
            let i = 0
            let interval = setInterval(() => {
                if(i == difference -1){
                    clearInterval(interval)
                }
                i++
                handleMoveLeft()
            }, 50);
        }
        else{
            // handleMoveRight()
            difference = -difference
            let i = 0
            let interval = setInterval(() => {
                console.log(i)
                if(i == difference -1){
                    console.log('cleared', i , difference)
                    clearInterval(interval)
                }
                i++
                handleMoveRight()
            }, 50);
        }
    }
    
  return (
    <>
        <div className="section">
            {!isLoading && overviewData &&
                <div className='image-container'>
                    <div className='front-image move flash'>
                        <div className="front-image-carousel">
                            {roomDisplay.length !== 0 && roomDisplay.map((x,i) => {
                                return <img data-position={100*i} key={i} className="front-image-carousel-item animate" src={x}></img>
                            })}
                    
                        </div>
                        <div className="navigation-container-wrapper">
                            <div onClick={handleMoveRight} className="navigation-chevron left"></div>
                            <div className='navigation-image-container'>
                            {roomDisplay.length !== 0 && roomDisplay.map((x,i) => {
                                return (
                                    <div onClick={handleImage} key={i} data-position={100*i} className='navigation-image-wrapper'><img className='navigation-image' src={x}></img></div>
                                )
                            })}
                            </div>
                            <div onClick={handleMoveLeft} className="navigation-chevron right"></div>

                        </div>
                    </div>
                    <div className="front-image-overview">
                        <div className="front-image-container-title moveleft movedown">{overviewData.hotel.hotelTitle}</div>
                        <div className="front-image-container-body fadeout">
                            <div className='location'>
                                <svg width="103" height="138" viewBox="0 0 103 138" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M51.8377 0C23.6265 0 0.675415 22.9603 0.675415 51.1826C0.675415 93.232 46.7452 134.29 48.7071 136.017C49.6014 136.805 50.7193 137.199 51.8377 137.199C52.9561 137.199 54.074 136.805 54.9688 136.017C56.9298 134.29 103 93.2325 103 51.1826C103 22.9603 80.049 0 51.8377 0ZM51.8377 125.969C41.6522 116.099 10.15 82.9939 10.15 51.1826C10.15 28.1849 28.8511 9.47458 51.8377 9.47458C74.8243 9.47458 93.5254 28.1849 93.5254 51.1826C93.5254 82.9934 62.0232 116.098 51.8377 125.969Z" fill="black"/>
                                    <path d="M28.6517 51.1827C28.6517 38.3086 39.0563 27.8396 51.8377 27.8396C64.6191 27.8396 75.0237 38.3086 75.0237 51.1827C75.0237 64.0572 64.6192 74.5257 51.8377 74.5257C39.0563 74.5257 28.6517 64.0572 28.6517 51.1827ZM37.1258 51.1827C37.1258 59.3765 43.7199 66.0511 51.8377 66.0511C59.9555 66.0511 66.5496 59.3765 66.5496 51.1827C66.5496 42.9888 59.9555 36.3142 51.8377 36.3142C43.7199 36.3142 37.1258 42.9893 37.1258 51.1827Z" fill="black" stroke="black"/>
                                </svg>
                                {overviewData.hotel.hotelLocation}
                            </div>
                            <div className="stars-rating-container">
                                <div className="stars">
                                    <div className="stars-rating">{overviewData.hotel.rating.averageRating}</div>
                                    <Stars rating={overviewData.hotel.rating.averageRating} width={11}></Stars>
                                </div>
                            </div>
                            <div className="front-image-container-body-title">Overview</div>
                            <div className="front-image-container-body-description">{overviewData.hotel.hotelDescription}</div>
                            <div className="front-image-container-facilities">
                                <div className="front-image-container-facility"></div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    </>
  )
}
