import React, { useEffect, useState } from 'react'

export default function HotelNavLeft() {
  
    useEffect(() => {
        let container = document.querySelector('.overview-container')
        container.addEventListener('wheel', (e) => {
          let targ = e.target.closest('.hotel-content-body-wrapper')
          if(targ !== null){
            let targValue = parseFloat(targ.dataset.defer)
            if( targValue < 8 ){
              return
            }
          }
          let targ2 = e.target.closest('.person-review-card-wrapper')
          if(targ2 !== null){
            let targValue = parseFloat(targ2.dataset.defer)
            if( targValue < 8 ){
              return
            }
          }
      e.preventDefault()

          let carousel = document.querySelector('.overview-carousel')
          let originalPosition = Number(getComputedStyle(carousel).getPropertyValue("--item-index"))
          if(e.deltaY < 0){
            let n = originalPosition -1 
            handleclick(n)
          }
          if(e.deltaY > 0){
            let n = originalPosition +1 
            handleclick(n)
          }
        })
      }, [])
    function handlescroll(n){
        if( n <= -1 || n >= 4) return
        let carousel = document.querySelector('.overview-carousel')
        carousel.style.top = `${-n*100}vh`
        carousel.style.setProperty("--item-index", `${n}`)
      }
    function handleclick(e){
        let interval

        let navLeft = document.querySelector('.hotel-nav-left')
        if(e <= 0 || e == 3){
            navLeft.style.opacity = `0%`
        }
        else{
            navLeft.style.opacity = `100%`
        }

        let carousel = document.querySelector('.overview-carousel')
        let navItem = Number(getComputedStyle(carousel).getPropertyValue("--item-index"))
        if( navItem == e) return
        handlescroll(Number(e))

        let lines = document.querySelectorAll(`.hotel-nav-line`);
        let symbols = document.querySelectorAll('.hotel-nav-symbol')
        lines = Array.from(lines)
        symbols = Array.from(symbols)

        if( navItem > e){
            lines = lines.filter(x => {
                let value = x.dataset.item > e && x.dataset.item <= navItem
                return value
            })
            symbols = symbols.filter(x => {
                let value = x.dataset.item > e && x.dataset.item <= navItem
                return value
            })
            let length  = lines.length
            let i = 0
            handleremove()
            interval = setInterval(handleremove, 500)
            function handleremove(){
                if( i >= length){
                    clearInterval(interval)
                    return
                }
                lines[length -1 -i].classList.remove('previous')
                symbols[length -1 -i].classList.remove('previous')
                i++
            }
        }
        if( navItem < e){
            lines = lines.filter(x => {
                let value = x.dataset.item <= e && x.dataset.item > navItem
                return value
            })
            symbols = symbols.filter(x => {
                let value = x.dataset.item <= e && x.dataset.item > navItem
                return value
            })
            let i = 0
            let length  = lines.length
            handleadd()
            interval = setInterval(handleadd, 500)
            function handleadd(){
                if( i >= length){
                    clearInterval(interval)
                    return
                }
                lines[i].className += ' previous'
                symbols[i].className += ' previous'
                i++
            }
        }
    }
  return (
    <>
        <div className="hotel-nav-left">
          <div className="hotel-nav-container">
            <div data-item="0" onClick={(e) => handleclick(e.target.dataset.item)} className="hotel-nav-symbol previous"></div>
            <div data-item="1" className="hotel-nav-line 1"></div>
            <div data-item="1" onClick={(e) => handleclick(e.target.dataset.item)} className="hotel-nav-symbol "></div>
            <div data-item="2" className="hotel-nav-line 2"></div>
            <div data-item="2" onClick={(e) => handleclick(e.target.dataset.item)} className="hotel-nav-symbol"></div>
            <div data-item="3" className="hotel-nav-line 3"></div>
            <div data-item="3" onClick={(e) => handleclick(e.target.dataset.item)} className="hotel-nav-symbol"></div>
          </div>
          <div className="hotel-nav-left-items">
            <div className="hotel-nav-left-item"></div>
            <div className="hotel-nav-left-item"></div>
            <div className="hotel-nav-left-item"></div>
            <div className="hotel-nav-left-item"></div>
          </div>
        </div>
    </>
  )
}
