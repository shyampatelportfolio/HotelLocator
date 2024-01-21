import React from 'react'
import { Loader } from "@googlemaps/js-api-loader"
import { useEffect, useState, useRef } from 'react'
export default function Page2({house}) {
        
    const mapref = useRef();

    useEffect(() => {
        const loader = new Loader({
            apiKey: "AIzaSyD0k860HQHerScESWWENVvopFyYv4LKVqQ",
            version: "quarterly",
          });
        loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary("maps");
      
        let map = new Map(mapref.current, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
          mapId: '8e347121f813e11f',
          streetViewControl: false,
          gestureHandling: "greedy",
        });
      });
      
      },[])
  return (
    <>
            <div className='content-container scroll-item'>
                <div className="content-location">{house.area.place}</div>
                <div className="content-body-title">About this Area</div>    
                <div className="content-area-description">{house.area.description}</div>
                <div className="content-area-card-container">
                    <div className="content-area-card">
                        <div className="content-area-card-icon">
                            
                        </div>
                        What's nearby?
                    </div>
                    <div className="content-area-card">

                    </div>
                    <div className="content-area-card"></div>
                </div>
            </div>
            <div className="map-container">
                <div ref={mapref} className="map1" />
            </div>
    </>
  )
}
