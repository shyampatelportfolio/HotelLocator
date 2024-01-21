import React from 'react'
import { useEffect, useState, useRef } from 'react'
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

export default function SearchbarHotels({passedRef, fetchFunction, inputHoverParent}) {


    const [inputHover, setInputHover] = useState(false);
    const searchBarRef = useRef()
    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
      } = usePlacesService({
        apiKey:"AIzaSyD0k860HQHerScESWWENVvopFyYv4LKVqQ",
      });

    useEffect(() => {
        if(inputHoverParent == false) handleDisableSearchbar() 
    }, [inputHoverParent])


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
    async function handleLocationChange(x){
    handleDisableSearchbar()
    let location = await convertToLatLng(x)
    let coordinates = {
        "lon": location.lng(),
        "lat": location.lat()
    }
    fetchFunction(coordinates)
    // fetchData(50, coordinates)
    }
    async function handleKeyDown(code){
        if(code == "ArrowUp" || code == "ArrowDown" || code == "Enter"){
      
          const item = document.querySelector('.hotel-content-searchbar-suggestions2.selected')
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
          const newItem = document.querySelector(`[data-id="${newReference}"].hotel-content-searchbar-suggestions2`)
          newItem.className += ' selected'
        }
    }
    function handleEnableSearchbar(){
        setInputHover(true)
        passedRef.current.style.opacity = 0
        searchBarRef.current.classList.add('selected')
    }
    function handleDisableSearchbar(){
        setInputHover(false)
        passedRef.current.style.opacity = 1
        searchBarRef.current.classList.remove('selected')
    }


    
  return (
    <div ref={searchBarRef} className="hotels-searchbar">
                    <svg className='search-icon' width={20} height={20} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path className='search-icon-path' d="M17 17L14 14M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="rgb(123, 123, 123)" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                    <input 
                      onChange={(evt) => {
                      getPlacePredictions({ input: evt.target.value });
                      }}
                      onClick={handleEnableSearchbar}
                      onKeyDown={(e) => handleKeyDown(e.code)}
                      className='hotel-content-searchbar-input2' type="text"
                    />
                    {inputHover &&    
                    <>
                      <div onClick={handleDisableSearchbar} className="hotel-content-searchbar-cancel">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 6L18 18" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="hotel-content-searchbar-suggestions-container2">
                        {placePredictions.map((x,i) => {
                          return <div data-id={i} data-place={x.place_id} onClick={() => handleLocationChange(x.place_id)} key={i} className={`hotel-content-searchbar-suggestions2 ${i == 0? "selected" : "none"}`}>
                            {x.description}
                          </div>
                        })}
                      </div>
                    </>             
                    }
                </div>
  )
}
