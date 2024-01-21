import React from 'react'
import { useEffect } from 'react'
export default function ScrollCard({changegalleryroom, rooms}) {


  useEffect(() => {
    if(rooms.length == 0) return
      const handleOnDown = (e) => {
        carousel.dataset.mouseDownAt = e.clientX};
      const handleOnUp = () => {
        carousel.dataset.mouseDownAt = "0";  
        carousel.dataset.prevPercentage = carousel.dataset.percentage;
      }
      const handleOnMove = e => {
        if(carousel.dataset.mouseDownAt === "0") return;
        
        const mouseDelta = parseFloat(carousel.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth/2;
        
        const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(carousel.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 60), -60);
        
        let displayPercentage = Math.floor((60 -Math.floor(nextPercentage))/1.2)
        let displayItem = document.querySelector('.hotel-room-scroller-percentage')
        displayItem.textContent = `${displayPercentage}%`
        carousel.dataset.percentage = nextPercentage;
        
        carousel.animate({
            transform: `translate(${nextPercentage}%)`
          }, { duration: 1200, fill: "forwards" });
  
            }
            let carousel = document.querySelector('.hotel-room-scroller-carousel')
            let scroller = document.querySelector('.hotel-room-scroller')
            scroller.addEventListener('mousedown', handleOnDown)
        
            let selectionContainer = document.querySelector('.hotel-room-selection')
            selectionContainer.addEventListener('mousemove', handleOnMove)
            selectionContainer.addEventListener('mouseup', handleOnUp)
  }, [rooms])

  function handlechange(e, roomId){
    function eventfunction(){
      changegalleryroom(roomId)
    }
    e.target.addEventListener('mouseup', eventfunction, {once: true})
    setTimeout(() => {
      e.target.removeEventListener('mouseup', eventfunction)}, 100)
  }
  return (
    <>
      <div className="hotel-room-scroller-carousel" data-mouse-down-at="0" data-prev-percentage="0">
        {rooms.length !== 0 && rooms.map((x,i) => {
          return (
          <div key={i} onMouseDown={(e) => handlechange(e, x.roomId)} className="hotel-room-scroller-card">
                    <div className="image-card">
                        {<img className='noselect' draggable={false} src={x.images[0]}></img>}
                    </div>
                    <div className="scroller-card-body">
                      <div className="scroller-card-title noselect">{x.roomTitle}
                      
                      </div>
                      <div className="scroller-card-description noselect">
                        {x.roomDescription}
                      </div>
                        <div className="scroller-card-price-container">
                          <div className="scroller-card-price noselect">
                            £{x.price}
                          </div>
                            <div className="scroller-pernight noselect">/night</div>

                        </div>
                    </div>
                  </div>
            )
        })}
      </div>
      <div className="hotel-room-scroller-percentage">50%</div>



   

    </>
  )
}
