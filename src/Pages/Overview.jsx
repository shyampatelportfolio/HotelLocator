import HotelRoomGallery from '../Components/Pages/HotelRoomGallery'
import FrontImage from '../Components/Pages/FrontImage'
import Reviews from '../Components/Pages/Reviews'
import HotelInformation from '../Components/Pages/HotelInformation'
import HotelNavLeft from '../Components/Props/HotelNavLeft'
import hotelData from '../Data/Hotels.json'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../Components/Props/NavBar'
import axios from 'axios'


export default function Overview() {

  const { id } = useParams()
 
  return (
    <>
            <div  className='overview-container'>

              <NavBar color={"white"}></NavBar>
              
              <div className="overview-carousel">
                <HotelNavLeft ></HotelNavLeft>
                <FrontImage id={id}></FrontImage>
                <HotelInformation></HotelInformation>
                <Reviews id={id}></Reviews>
                <HotelRoomGallery id={id}></HotelRoomGallery>
              </div>

            </div>

    </>
  )
}