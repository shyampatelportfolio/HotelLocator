import React, { useState, useEffect, useRef } from 'react'
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { useNavigate } from "react-router-dom";

export default function SearchbarHome({hover}) {
  const [inputHover, setInputHover] = useState(false);
  const navigate = useNavigate();
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey:"AIzaSyD0k860HQHerScESWWENVvopFyYv4LKVqQ",
  });


  useEffect(() => {

    const searchbar = document.querySelector('.home-content-searchbar')
    const carousel = document.querySelector('.home-image-carousel')
    const background = document.querySelector('.home-background')
      if( inputHover == true ){
        carousel.style.opacity = 0.5
        background.style.opacity = 0.5
        searchbar.className += ' selected'
      }
      if( inputHover == false ){
        carousel.style.opacity = 1
        background.style.opacity = 1
        searchbar.classList.remove('selected')
      }
  }, [inputHover])

  useEffect(() => {
    setInputHover(hover[0])
  }, [hover])



  async function handleKeyDown(code){
    if(code == "ArrowUp" || code == "ArrowDown" || code == "Enter"){
  
      const item = document.querySelector('.home-content-searchbar-suggestions.selected')
      if( item == null) return
      const reference = item.dataset.id
      if(code == "Enter"){
        const placeId = item.dataset.place
        await handleLocationChange(placeId)
        return
      }
      let newReference
      if(code == "ArrowDown"){
        if( reference == 4){
          newReference = 4
        }else{
          newReference = Number(reference) + 1
        }
      }
      if(code == "ArrowUp"){
        if( reference == 0){
          newReference = 0
        }else{
          newReference = Number(reference) - 1
        }
      }
  
      item.classList.remove('selected')
      const newItem = document.querySelector(`[data-id="${newReference}"].home-content-searchbar-suggestions`)
      newItem.className += ' selected'
    }
  }
  async function handleLocationChange(x){
    setInputHover(false)
    let location = await convertToLatLng(x)
    let coordinates = {
      "lon": location.lng(),
      "lat": location.lat()
    }
    // console.log(coordinates)
    navigate('/Search', { state: { coordinates } });
  
  }
  async function convertToLatLng(x){
    let response = await new Promise((res) => {
      placesService?.getDetails(
        {
          placeId: x,
        },
        (placeDetails) => {
          res(placeDetails.geometry.location)
        } 
        );
    })
    return response
  }
  return (
    <>
          <div className="home-content-searchbar-hover"></div>
          <div className="home-content-searchbar">
                          <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 17L14 14M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                          <input 
                                  onChange={(evt) => {
                                  getPlacePredictions({ input: evt.target.value });
                                  setInputHover(true)
                                  }}
                                  onClick={() => {
                                    setInputHover(true)
                                  }}
                                  onKeyDown={(e) => handleKeyDown(e.code)}
                          className='home-content-searchbar-input' type="text" />
                          {inputHover &&                 
                          <div onClick={() => setInputHover(false)} className="home-content-searchbar-cancel">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6 6L18 18" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          }

                          {inputHover && <div className="home-content-searchbar-suggestions-container">
                          {placePredictions.map((x,i) => {
                              return (
                                  <div data-id={i} data-place={x.place_id} onClick={() => handleLocationChange(x.place_id)} key={i} className={`home-content-searchbar-suggestions ${i == 0? "selected" : "none"}`}>
                                  {x.description}
                                  </div>
                              )
                          })}
                          </div>
                          }
          </div>
    </>
  )
}
