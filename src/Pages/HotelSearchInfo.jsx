import React from 'react'
import { useEffect, useState, useRef } from 'react'
import HotelMarker from '../Components/Props/HotelMarker';
import ReactDOM from 'react-dom/client';
import Filter from '../Components/Props/Filter'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import NavBar from '../Components/Props/NavBar';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import HotelCard from '../Components/Props/HotelCard';
import { quantityBool, filterItem, compareByPrice, compareByRating, compareByMaxPrice } from '../Functions/Functions1';
import SearchbarHotels from '../Components/Props/SearchbarHotels';

export default function HotelSearchInfo() {

    const [coordinatesPlaced, setCoordinatesPlaced] = useState(null)
    const {data : hotels, status, isLoading, refetch } = useQuery({
      queryKey : ['Hotels', coordinatesPlaced],
      queryFn : () => fetchHotels(coordinatesPlaced),
    })
    const [hotelsFiltered, setHotelsFiltered] = useState([])

    const mapRef = useRef();
    const googleMap = useRef();

    const [inputHover, setInputHover] = useState(null);
    const [markers, setMarkers] = useState([])

    const navigate = useNavigate();
    const location = useLocation();
    const receivedData = location.state?.coordinates || null;

    const resultsRef = useRef()


    let timeoutId;

    useEffect(() => {
     
      init(receivedData)
      let hotelSearchContentWrapper = document.querySelector('.hotels-content-container')
      hotelSearchContentWrapper.addEventListener('click', handleHotelNavigate)
   
    }, [])
 

    useEffect(() => {
      console.log('filter')
      setTimeout(() => {
        createMarkers(hotelsFiltered)
      }, 1000);
      

    }, [hotelsFiltered])



async function fetchHotels(coordinates){
  if(coordinates == null) return null

  let url = `${import.meta.env.VITE_APP_API_BASE_URL}/FindHotels/HotelShortlist`
  const response = await axios.post(url, coordinates)
  if(response.data.message == 'Too Far'){
    window.alert("We couldn't find any hotels in your location, but we found this instead")
  }
  const hotelData = response.data.hotelShortlist
  let panToCoordinate = hotelData[0].filters.coordinates
  
  const newCenter = new google.maps.LatLng(panToCoordinate.lat, panToCoordinate.lon)
  googleMap.current.panTo(newCenter)
  setHotelsFiltered(hotelData)
  return hotelData
}
function handleHotelNavigate(e){

  const hotelcard = e.target.closest('.hotel-card')
  const hotelcardButton = e.target.closest('.hotel-card-booking-button')
  if(hotelcardButton !== null){
    const hotelId = hotelcard.querySelector('.hotel-card-background').dataset.id
    let hotelTransferOverlay = document.querySelector('.hotels-transfer-overlay')
    hotelTransferOverlay.classList.add('selected')
    setTimeout(() => {
      navigate(`/Hotel/${hotelId}`);
    }, 2000)
  }       
}
function init(coordinates){
  let x = coordinates
  if(coordinates == null){
    x = {
      "lat" : 51.465,
      "lon" : -0.08808
    }
  }
  let tempmap = new google.maps.Map(mapRef.current, {
    zoom: 10,
    center: { lat: x.lat, lng: x.lon },
    mapId: '8e347121f813e11f',
    streetViewControl: false,
    zoomControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
  });
  googleMap.current = tempmap
  // fetchData(50, x)
  setCoordinatesPlaced(x)
  // refetch()
}
function fetchFunction(coordinates){
  setCoordinatesPlaced(coordinates)
}
function handleInputExit(e){
  const item = e.target.closest('.hotels-searchbar')
  if(item ==  null){
    setInputHover(false)
  }
}


async function createMarkers(items){
    markers.forEach(x => x.setMap(null))
    setMarkers([])
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    let n = items.length
    let markersArray = []
    for(let i = 0; i < n; i++){
      let local = items[i].filters.coordinates
      const priceTag = document.createElement("div");
      ReactDOM.createRoot(priceTag).render(<HotelMarker info={items[i]}/>);
      priceTag.className += " hotel-marker";

      priceTag.dataset.id = items[i].hotelId
      const marker = new AdvancedMarkerElement({
        map: googleMap.current,
        position: { lat: local.lat, lng: local.lon },
        content: priceTag,
        zIndex : i
      });
      marker.addListener('click', () => handleMarker(items[i].hotelId, items[i].filters.coordinates))
      priceTag.addEventListener('mouseenter', () => marker.zIndex = 100)
      priceTag.addEventListener('mouseleave', () => marker.zIndex = i)
      markersArray.push(marker)
    }
    setMarkers(markersArray)
  }
function handleMarker(e, coordinates){
    
    const hotelCardBackground = document.querySelector(`[data-id="${e}"].hotel-card-background`)
    if(!hotelCardBackground.classList.contains('selected')){
        return
    }
    const newCenter = new google.maps.LatLng(coordinates.lat, coordinates.lon)
    googleMap.current.panTo(newCenter)
    let index;
    hotelsFiltered.forEach((x,i) => {
        if(x.hotelId == e) index = i
    })
    const unit = window.innerHeight/100
    const scrollHeight = ((30*index)*unit).toString()
    cardScroll(scrollHeight)
    setTimeout(() => {
        
        hotelCardBackground.style.opacity = 0
        hotelCardBackground.style.left = 0
    }, 500);
    setTimeout(() => {
        
        hotelCardBackground.classList.remove('selected')
    }, 2600);
    setTimeout(() => {
        hotelCardBackground.style.opacity = 1
        hotelCardBackground.style.left = '-200%'
    }, 2700);
    setTimeout(() => {
        hotelCardBackground.className += ' selected'
        
    }, 2800);
}


function handleSortHotels(hotels){
  const sortButton = document.querySelector('.hotels-sort-button.selected')
  const sortPhrase = sortButton.dataset.val
  let arr = [...hotels]
      if(sortPhrase == 'rated'){
        arr.sort(compareByRating)
        return arr
      }
      if(sortPhrase == 'low'){
        arr.sort(compareByPrice)
        return arr
      }
      if(sortPhrase == 'high'){
        arr.sort(compareByMaxPrice)
        return arr
      }
      if(sortPhrase == 'all'){
        return arr
      }
}
function handleNav(e){
  if(hotelsFiltered.length == 0) return
  let buttons = document.querySelectorAll('.hotels-sort-button')
  if (e.target.tagName === 'BUTTON') {
    buttons.forEach(x => {
      x.classList.remove('selected')
      e.target.className += ' selected'
    })
    setHotelsFiltered(prev =>
      handleSortHotels(prev)
    )
  }
}
function handleFilter(options){
  let hotelsFilteredTemp = hotels.filter(x => {
    let bool = filterItem(options.bools, x.filters.bools)
    let quantityBool1 = quantityBool(options.quantities, x.filters.quantities)
    return bool && quantityBool1 
  })
  const sortedHotels = handleSortHotels(hotelsFilteredTemp)
  setHotelsFiltered(sortedHotels)
}


function handleHotelCard(id){
  const info = hotelsFiltered.filter(x => {return x.hotelId == id})
  const coordinates = info[0].filters.coordinates
  const newCenter = new google.maps.LatLng(coordinates.lat, coordinates.lon)
  googleMap.current.panTo(newCenter)
}
function cardScroll(x){
  let hotelCardContainer = document.querySelector('.hotels-card-wrapper')


    hotelCardContainer.scrollTo({
        top: x,
        behavior: 'smooth'
    });

}


function handleWheel(e){
  const hotelsGoogleMap = document.querySelector('.hotels-google-map')
  hotelsGoogleMap.classList.remove('selected')
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
      hotelsGoogleMap.className += ' selected'
  }, 1000);
}
function swipeFilter(){
  const filterWrapperContainer = document.querySelector('.filter-wrapper')
  const map = mapRef.current
  const button = document.querySelector('.filter-button-text')
  const ref = map.dataset.swipe
  if( ref == '0'){
    button.textContent = 'Map'
    filterWrapperContainer.style.opacity = 1
    map.style.opacity = 0
    filterWrapperContainer.style.zIndex = 1
    map.dataset.swipe = 1
  }else{
    button.textContent = 'Filter'
    filterWrapperContainer.style.opacity = 0
    filterWrapperContainer.style.zIndex = -1
    map.style.opacity = 1
    map.dataset.swipe = 0

  }
}
  return (
    <>
     
          <NavBar color={"black"}></NavBar>

    
        <div className="hotels-transfer-overlay">
        </div>
        <div onClick={(e) => handleInputExit(e)} className="hotels-content-container">
          <div className="hotels-container" data-swipe="0">
                <SearchbarHotels passedRef={resultsRef} fetchFunction={fetchFunction} inputHoverParent={inputHover}/>
                <div ref={resultsRef} className="hotels-results-container">
                  <div className="hotels-sort">
                              <div onClick={(e) => handleNav(e)} className="hotels-sort-left">
                                  <button data-val="all" className='hotels-sort-button selected'>All</button>
                                  <button data-val="rated" className='hotels-sort-button'>Top Rated</button>
                                  <button data-val="low" className='hotels-sort-button '>Lowest</button>
                                  <button data-val="high" className='hotels-sort-button'>Highest</button>
                              </div>
                              <div className="hotels-sort-right">
                                  {hotelsFiltered? hotelsFiltered.length : 0} Results found
                              </div>
                  </div>
                  {isLoading?
                    <>
                      <div className="hotel-loading-container">
                        <div className="loader"></div>
                      </div>
                    </> :
                    <>
                      <div onWheel={handleWheel} className="hotels-card-wrapper">
                          <div className="hotels-cards" data-scroll="0">
                              {hotelsFiltered.map((x,i) => {
                                  return <HotelCard key={i} info={x} handleHotelCard={handleHotelCard}></HotelCard>
                              })} 
                          </div>
                      </div>
                    </>
                  }
                 
                </div>
          </div>
          <div className="hotels-map-wrapper"  >
            <div data-swipe="0" ref={mapRef} className="hotels-google-map selected"></div>
            <div onClick={swipeFilter} className="filter-button">
              <div className="filter-button-text">Filter</div>
            </div>
            <Filter filterfunction={handleFilter} swipeFilter={swipeFilter}></Filter>

          </div>

        </div>
    </>
  )
}