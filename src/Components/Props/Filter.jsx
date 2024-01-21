import React, { useEffect, useState } from 'react'
export default function Filter({filterfunction, swipeFilter}) {

  const[inputValues, setInputValues]= useState([0,800])
  const[amenitiesValues, setAmenitiesValues]= useState(null)
  const[options, setOptions]= useState([])

  useEffect(() => {
    init()
    function init(){
      let items = document.querySelectorAll('.filter-card-amenities-item')
      let amenitiesWidth = Number(getComputedStyle(items[0]).width.slice(0,-2))
      let gap = 5*amenitiesWidth/90
      let unit = amenitiesWidth +2*gap
      setAmenitiesValues([gap, unit])
      items.forEach((x,i) => {
        x.style.setProperty("--item-index", `${gap + unit*(i - 1)}px`)
      })
    }
    const maxInput = document.querySelector('.range-max')
    const max = Number(maxInput.max)
    setOptions(
      { 
        "bools" : {
            "amenities" : {
                "kitchen" : false,
                "washing" : false,
                "restaurant" : false,
                "wifi" : false,
                "gym" : false,
                "parking" : false
            },
            "travellerExperiences" : {
                "lgbtq" : false,
                "businessFriendly" : false,
                "familyFriendly" : false
            },
            "misc" : {
                "instantBook" : false,
                "selfCheckIn" : false,
                "superHost" : false
            }
        },
        "quantities" : {
            "minPrice" : 0,
            "maxPrice" : max,
            "rating" : 0,
        },
        "radius" : 5000
    }
    )
    let maxValue = Number(document.querySelector('.range-max').value)
    let minValue = Number(document.querySelector('.range-min').value)
    // let radius = Number(document.querySelector('.radius-input').value)
    handlemin(minValue)
    handlemax(maxValue)
    // handleradiuschange(radius)
  }, [])

  const travellerexperiences = [
    {
      "title" : "LGBTQ Welcoming",
      "description" : "See properties that pledge to make all guests feel safe, welcome and respected."
    },
    {
      "title" : "Business Friendly",
      "description" : "See properties with amenities to help you work comfortably like WiFi and breakfast"
    },
    {
      "title" : "Family Friendly",
      "description" : "See properties that include familiy essentials like in-room conveniencies and activities for kids"
    },
  ]


function handlemin(e){

    setOptions(prev => {
      let obj = {...prev}
      obj.quantities.minPrice = e
      return obj
    })
    const minInput = document.querySelector('.range-min')
    const max = Number(minInput.max)
    let minValue = Number(e)
    let maxValue = Number(document.querySelector('.range-max').value)
    const priceGap = 1
    if(maxValue - minValue <= priceGap){
      minValue = maxValue - priceGap
      e = minValue
    }
    setInputValues(prev => [e, prev[1]])
    let progressBar = document.querySelector('.progress-bar.price')
    let percentage =(minValue/max)*100 + '%'
    progressBar.style.left = percentage
}
function handlemax(e){
    setOptions(prev => {
      let obj = {...prev}
      obj.quantities.maxPrice = e
      return obj
    })
    const maxInput = document.querySelector('.range-max')
    const max = Number(maxInput.max)
    let maxValue = e
    let minValue = Number(document.querySelector('.range-min').value)
    const priceGap = 1
    if(maxValue - minValue <= priceGap){
      maxValue = minValue + priceGap
      e = maxValue
    }
    setInputValues([inputValues[0], e])
    let progressBar = document.querySelector('.progress-bar.price')
    let percentage =((max-maxValue)/max)*100 + '%'
    progressBar.style.right = percentage

}
function handlepointer(e){
    let minInput = document.querySelector('.range-min')
    let minValue = Number(minInput.value)
    let maxInput = document.querySelector('.range-max')
    let maxValue = Number(maxInput.value)
    let halfway = (maxValue - minValue)/2

    if(minValue > e.target.value){
      minInput.value = e.target.value
      handlemin(e.target.value)
    }
    if(e.target.value > maxValue){
      maxInput.value = e.target.value
      handlemax(e.target.value)
    }
    if(e.target.value < minValue + halfway){
      minInput.value = e.target.value
      handlemin(e.target.value)
    }
    if(maxValue - halfway < e.target.value){
      maxInput.value = e.target.value
      handlemax(e.target.value)
    }
}
function handleRatingButton(e){
  let buttons = document.querySelectorAll('.filter-bed-button')
  if (e.target.tagName === 'BUTTON') {
    setOptions(prev => {
      let obj = {...prev}
      obj.quantities.rating = Number(e.target.dataset.button)
      return obj
    })
    buttons.forEach(x => {
      x.classList.remove('selected')
      e.target.className += ' selected'
    })
  }
}
function handleleft(){
  let gap = amenitiesValues[0]
  let unit = amenitiesValues[1]
  let items = document.querySelectorAll('.filter-card-amenities-item')
  let count = items.length
  items.forEach((x,i) => {
    let int1 = Number(getComputedStyle(x).getPropertyValue("--item-index").slice(0,-2))
    let intlower = Math.floor(int1)
    let intupper = Math.ceil(int1)
    if(gap + (count-3)*unit >= intlower && intupper >= gap + (count-3)*unit){
      x.classList.remove('last')
    }
    if(gap - 2*unit >= intlower && intupper >= gap - 2*unit){
      x.className += ' last'
      int1 = gap + unit*(count-2)
    }
    x.style.setProperty("--item-index", `${int1 - unit}px`)
  })
}
function handleright(){
  let gap = amenitiesValues[0]
  let unit = amenitiesValues[1]
  let items = document.querySelectorAll('.filter-card-amenities-item')
  let count = items.length
  items.forEach((x,i) => {
    let int1 = Number(getComputedStyle(x).getPropertyValue("--item-index").slice(0,-2))
    let intlower = Math.floor(int1)
    let intupper = Math.ceil(int1)
    if(gap + (count-2)*unit >= intlower && intupper >= gap + (count-2)*unit){
      x.className += ' last'
      int1 = gap - 2*unit
    }
    if(gap - unit >= intlower && intupper >= gap - unit){
      x.classList.remove('last')
    }

  })
}
function handletravellerexperiences(e){
  
  let targetItem = e.target.closest('.filter-card-traveller-experiences-item')
  let reference = targetItem.dataset.val
  switch(reference){
    case '0':
      reference = 'lgbtq';
      break;
    case '1':
      reference = 'businessFriendly';
      break;
    case '2':
      reference = 'familyFriendly';
      break;
    default:
      console.log('Selected fruit is unknown');
  }
  if( targetItem.classList.contains('selected')){
    targetItem.classList.remove('selected')
    setOptions(prev => {
      let obj = {...prev}
      obj.bools.travellerExperiences[reference] = false
      return obj
    })
  }else{
    setOptions(prev => {
      let obj = {...prev}
      obj.bools.travellerExperiences[reference] = true
      return obj
    })
    targetItem.className += ' selected'
  }
}
function handleamenitiesitems(e){
  let targetItem = e.target.closest('.filter-card-amenities-item')
  let reference = targetItem.dataset.val
  if( targetItem.classList.contains('selected')){
    setOptions(prev => {
      let obj = {...prev}
      obj.bools.amenities[reference] = false
      return obj
    })
    targetItem.classList.remove('selected')
  }else{
    setOptions(prev => {
      let obj = {...prev}
      obj.bools.amenities[reference] = true
      return obj
    })
    targetItem.className += ' selected'
  }
}
function handlebooking(e){
  let targetItem = e.target.closest('.booking-item-inner')
  let reference = targetItem.dataset.val
  if( targetItem.classList.contains('selected')){
    setOptions(prev => {
      let obj = {...prev}
      obj.bools.misc[reference] = false
      return obj
    })
    targetItem.classList.remove('selected')
  }else{
    setOptions(prev => {
      let obj = {...prev}
      obj.bools.misc[reference] = true
      return obj
    })
    targetItem.className += ' selected'
  }
}

function handlereset(){
  const maxInput = document.querySelector('.range-max')
  const minInput = document.querySelector('.range-min')
  const max = Number(maxInput.max)
  maxInput.value = maxInput.max
  handlemax(maxInput.max)
  minInput.value = 0
  handlemin(0)
  // const radiusInput = document.querySelector('.radius-input')
  // radiusInput.value = radiusInput.max
  // handleradiuschange(radiusInput.max)
  const buttons = document.querySelectorAll('.filter-bed-button')
  buttons.forEach((x,i) => {
    x.classList.remove('selected')
    if( i == 0){
      x.className += ' selected'
    }
  })
  const travellerExperiencesItems = document.querySelectorAll('.filter-card-traveller-experiences-item')
  travellerExperiencesItems.forEach(x => x.classList.remove('selected'))
  const amenitiesItems = document.querySelectorAll('.filter-card-amenities-item')
  amenitiesItems.forEach(x => x.classList.remove('selected'))
  const bookingItems = document.querySelectorAll('.booking-item-inner')
  bookingItems.forEach(x => x.classList.remove('selected'))

  let item =  { 
    "bools" : {
        "amenities" : {
            "kitchen" : false,
            "washing" : false,
            "restaurant" : false,
            "wifi" : false,
            "gym" : false,
            "parking" : false
        },
        "travellerExperiences" : {
            "lgbtq" : false,
            "businessFriendly" : false,
            "familyFriendly" : false
        },
        "misc" : {
            "instantBook" : false,
            "selfCheckIn" : false,
            "superHost" : false
        }
    },
    "quantities" : {
        "minPrice" : 0,
        "maxPrice" : max,
        "rating" : 0,
    },
    "radius" : 5000
}
  setOptions(
   item
  )
  filterfunction(item)
  swipeFilter()
}
function filter(){
  filterfunction(options)
  swipeFilter()
}

  return (
    <>
       
        <div  className="filter-wrapper">
            {/* <div className="testbutton">
              <div  className="testbtn1">test1</div>
              <div  className="testbtn2">test2</div>
            </div> */}
          <div className="filter-header">
              Filters
          </div>
          <div className="filter-options">
            <div className="filter-card price">
                <div className="filter-card-title">Price</div>
                <div className="filter-price-container">
                  <input  onChange={(e) => handlemin(e.target.value)} defaultValue={0} className='range-min' type="range" min={0} max={800}/>
                  <input  onChange={(e) => handlemax(e.target.value)} defaultValue={800} className='range-max' type="range" min={0} max={800}/>
                  <div className="progress-bar price"></div>
                  <div  className="background-bar"></div>
                  <input onClick={(e) => handlepointer(e)} type="range" className='pointer-input' name="" id="" min={0} max={800} />
                </div>
                <div className="filter-price-values">
                    <div className="filter-price-min">£{inputValues[0]}</div>
                    <div className="filter-price-max">£{inputValues[1]}</div>
                </div>
            </div>
            {/* <div className="filter-card radius">
              <div className="filter-card-title">Radius</div>
              <div className="filter-radius-container">

                <input className='radius-input' onChange={(e) => handleradiuschange(e.target.value)} type="range" min={0} max={5000} />
                <div className="progress-bar radius"></div>
                <div  className="background-bar"></div>
              </div>
              <div className="filter-price-values radius">
                <div className="filter-price-min radius">200 m</div>
              </div>
            </div> */}
            <div className="filter-card">
              <div className="filter-card-title">Rating</div>
              <div onClick={(e) => handleRatingButton(e)} className="filter-bed-container">
                <button data-button="0" className="filter-bed-button">Any</button>
                <button data-button="1" className="filter-bed-button ">1</button>
                <button data-button="2" className="filter-bed-button selected">2</button>
                <button data-button="3" className="filter-bed-button">3</button>
                <button data-button="4" className="filter-bed-button">4</button>
                <button data-button="5" className="filter-bed-button">5</button>
              </div>
            </div>
            <div className="filter-card">
              <div className="filter-card-title">Traveller Experience</div>
              <div className="filter-card-traveller-experiences-container">
                {travellerexperiences.map((x,i) => {
                  return (
                    <div data-val={i} onClick={(e) => handletravellerexperiences(e)} key={i} className="filter-card-traveller-experiences-item">
                      <div className="filter-card-traveller-experiences-svg"></div>
                      <div className="filter-card-traveller-experiences-title">
                        {x.title}
                      </div>
                      <div className="filter-card-traveller-experiences-description">
                        {x.description}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="filter-card">
                <div className="filter-card-title">
                  Amenities
                </div>
                <div className="filter-card-amenities-container">
                  <button onClick={handleright} className="amenities-button left"></button>
                  <div onClick={(e) => handleamenitiesitems(e)} className="filter-card-amenities-carousel">
                    <div data-val={'wifi'} className="filter-card-amenities-item">
                      <div className="filter-card-amenities-item-svg wifi"></div>
                      Wifi
                    </div>
                    <div data-val={'kitchen'} className="filter-card-amenities-item">
                      <div className="filter-card-amenities-item-svg kitchen"></div>
                      Kitchen
                    </div>
                    <div data-val={'washing'} className="filter-card-amenities-item">
                      <div className="filter-card-amenities-item-svg washing"></div>
                      Washing
                    </div>
                    <div data-val={'gym'} className="filter-card-amenities-item">
                      <div className="filter-card-amenities-item-svg gym"></div>
                      Gym
                    </div>
                    <div data-val={'restaurant'} className="filter-card-amenities-item">
                      <div className="filter-card-amenities-item-svg restaurant"></div>
                      Restaurant
                    </div>
                    <div data-val={'parking'} className="filter-card-amenities-item">
                      <div className="filter-card-amenities-item-svg parking"></div>
                      Parking
                    </div>
                  </div>
                  <button onClick={handleleft} className="amenities-button right"></button>
                </div>
              </div>
              <div className="filter-card">
                <div className="filter-card-title">Booking Options</div>
                <div className="filter-card-booking-item">
                  <div className="booking-body">
                    <div className="booking-body-title">Instant Book</div>
                    <div className="booking-body-description">Listings you can book without waiting for hosts approval</div>
                  </div>
                  <div className="booking-item-container">
                    <div className="booking-item-outer">
                      <div onClick={(e) => handlebooking(e)} data-val="instantBook" className="booking-item-inner"></div>
                    </div>
                  </div>
                </div>
                <div className="filter-card-booking-item">
                  <div className="booking-body">
                    <div className="booking-body-title">Self Check-in</div>
                    <div className="booking-body-description">Easy access to the property when you arrive</div>
                  </div>
                  <div className="booking-item-container">
                    <div className="booking-item-outer">
                      <div onClick={(e) => handlebooking(e)} data-val="selfCheckIn" className="booking-item-inner"></div>
                    </div>
                  </div>
                  
                </div>
                <div className="filter-card-booking-item">
                  <div className="booking-body">
                    <div className="booking-body-title">SuperHost</div>
                    <div className="booking-body-description">Stay with top tier recognised hosts</div>
                  </div>
                  <div className="booking-item-container">
                    <div className="booking-item-outer">
                      <div onClick={(e) => handlebooking(e)} data-val="superHost" className="booking-item-inner"></div>
                    </div>
                  </div>
                  
                </div>
              </div>
          </div>
          
          <div className="filter-apply">
            <button onClick={handlereset}>Reset Filters</button>
            <button onClick={filter}>Apply</button>
          </div>
        </div>

    </>
  )
}
          