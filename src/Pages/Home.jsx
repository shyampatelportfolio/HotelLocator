import React, { useState, useEffect, useRef } from 'react'
import NavBar from '../Components/Props/NavBar'
import { useNavigate } from "react-router-dom";
import HomeData from '../Data/Home.json'
import SearchbarHome from '../Components/Props/SearchbarHome';

export default function Home() {


  const [inputHover, setInputHover] = useState([]);
  const [imageTransform, setImageTransform] = useState([]);
  const [lastClick, setLastClick] = useState(0)
  const [carouselAnimationRunning, setCarouselAnimationRunning] = useState(false)
  const animationIdRef = useRef(null);
  const navigate = useNavigate();
 

  useEffect(() => {
    let currentTime = new Date().getTime();
    setLastClick(currentTime)

    initPositions()
    
    setTimeout(() => {
      init(3)
    }, 1000);

    return () => {
      stopAnimation()
    }
  }, [])




  function initPositions(){
    let items = document.querySelectorAll('.home-image')
    items.forEach((x,i) => {
      let a = x.dataset.positionx
      const ratioHeight = 100/42
      const ratioWidth = 50/18
      x.style.transformOrigin = '0% 0%'
      if(i < 3){
        x.style.transform = `translateX(${a}vw) translateY(0vh) scale(1,1)`
      }else if(i == 3){
        x.style.transform = `translateX(${a}vw) translateY(0vh) scale(${ratioWidth},${ratioHeight})`
      }else{
        x.style.transform = `translateX(${a}vw) translateY(34.8vh) scale(1,1)`
      }
    })
  }
  function init(speed){
    let items = [...document.querySelectorAll('.home-image')]
    const ratioHeight = 100/42
    const ratioWidth = 50/18
    requestAnimationFrame(animate);
    function animate(){
      items.forEach((x) => {
        let a = Number(x.dataset.positionx)
  
          a += -speed/100

          if( a <= -18){
              x.dataset.positionx = a + 19*6 + 32
              x.style.transform = `translateX(${a}vw) translateY(0vh) scale(1,1)`
          }else if(a > -18 && a <26){
            x.dataset.positionx = a
            x.style.transform = `translateX(${a}vw) translateY(0vh) scale(1,1)`
          }else if( a <= 29 && a >= 26){
            x.dataset.positionx = a
            x.style.transform = `translateX(${a}vw) translateY(0vh) scale(${ratioWidth - (ratioWidth - 1)*((29-a)/3)},${ratioHeight - (ratioHeight - 1)*((29-a)/3)})`
            if(a < 26 + (speed)/100){
              x.style.transform = `translateX(${a}vw) translateY(0vh) scale(1,1)`
            }
          }else if( a <= 45 && a > 29){
            x.dataset.positionx = a
            x.style.transform = `translateX(${a}vw) translateY(0vh) scale(${ratioWidth},${ratioHeight})`
          }else if( a <= 80 && a > 45){
            //might need an adjusting function to scynhronise?
            a += (-speed/100)*(6*(ratioWidth - 1))
            x.dataset.positionx = a
            x.style.transform = `translateX(${a}vw) translateY(${(34.8/35)*(a-45)}vh) scale(${ratioWidth - (ratioWidth - 1)*((a-45)/35)},${ratioHeight - (ratioHeight - 1)*((a-45)/35)})`
          }else if( a > 80){
            if(a >= 80 && a <= 80 + speed/100 ){
              const id = x.dataset.id
              console.log(id)
              const navPrevSelected = document.querySelector('.home-nav-item.selected')
              navPrevSelected.classList.remove('selected')
              const navItem = document.querySelector(`[data-id="${id}"].home-nav-item`)
              navItem.className += ' selected'
            }
            x.dataset.positionx = a
            x.style.transform = `translateX(${a}vw) translateY(34.8vh) scale(1,1)`
          }
      })
      animationIdRef.current = requestAnimationFrame(animate);
      //put outside
    }
  }
  async function initNav(speed, reference){
    let items = document.querySelectorAll('.home-image')
    const ratioHeight = 100/42
    const ratioWidth = 50/18
    let myPromise = new Promise((res) => {
      let j = false
      requestAnimationFrame(animate);
      function animate(){
        items.forEach((x,i) => {
          if( j && i == 0){ res(0) }
          let a = Number(x.dataset.positionx)
          a += -speed/100
          if( a <= -18){
              x.dataset.positionx = a + 19*6 + 32
              x.style.transform = `translateX(${a}vw) translateY(0vh) scale(1,1)`
          }else if(a > -18 && a <26){
            x.dataset.positionx = a
            x.style.transform = `translateX(${a}vw) translateY(0vh) scale(1,1)`
          }else if( a <= 29 && a >= 26){
            x.dataset.positionx = a
            x.style.transform = `translateX(${a}vw) translateY(0vh) scale(${ratioWidth - (ratioWidth - 1)*((29-a)/3)},${ratioHeight - (ratioHeight - 1)*((29-a)/3)})`
            if(a < 26 + (speed)/100){
              x.style.transform = `translateX(${a}vw) translateY(0vh) scale(1,1)`
            }
          }else if( a <= 45 && a > 29){
            if( a < 45 && a >= 45 - speed/100){
              console.log(a)
              const id = x.dataset.id
              if( reference == id){
                j = true
              }
            }
            x.dataset.positionx = a
            x.style.transform = `translateX(${a}vw) translateY(0vh) scale(${ratioWidth},${ratioHeight})`
          }else if( a <= 80 && a > 45){
            //might need an adjusting function to scynhronise?
            a += (-speed/100)*(6*(ratioWidth - 1))
            x.dataset.positionx = a
            x.style.transform = `translateX(${a}vw) translateY(${(34.8/35)*(a-45)}vh) scale(${ratioWidth - (ratioWidth - 1)*((a-45)/35)},${ratioHeight - (ratioHeight - 1)*((a-45)/35)})`
          }else if( a > 80){
            if(a >= 80 && a <= 80 + speed/100 ){
              const id = x.dataset.id
              console.log(id)
              const navPrevSelected = document.querySelector('.home-nav-item.selected')
              navPrevSelected.classList.remove('selected')
              const navItem = document.querySelector(`[data-id="${id}"].home-nav-item`)
              navItem.className += ' selected'
            }
            x.dataset.positionx = a
            x.style.transform = `translateX(${a}vw) translateY(34.8vh) scale(1,1)`
          }
       
        })
        animationIdRef.current = requestAnimationFrame(animate);
      }
    })
    return myPromise
  }



  function handleInputExit(e){
    const item = e.target.closest('.home-content-searchbar')
    if(item ==  null){
      setInputHover([false])
    }
  }
 

  function handleImageClick(e){
    if(e.className.includes('home-image-carousel')){
      return
    }
    let currentTime = new Date().getTime();
    if (currentTime - lastClick < 2000) {
        console.log('stopped')
        return
    }
    stopAnimation()

    setLastClick(currentTime)
    const image = e
  
    image.className += ' animate'
    const myTransform = window.getComputedStyle(image).transform
    setImageTransform({
      id : image.dataset.id, 
      transform : myTransform
    })
    image.style.zIndex = 1

    const overviewText = document.querySelector('.overview-title')
    const overviewDescription = document.querySelector('.home-description.overview-description')
    const overviewFindHotels = document.querySelector('.home-find-hotels.overview-find-hotels')
    overviewText.textContent = HomeData[`City${image.dataset.id}`].title
    overviewDescription.textContent = HomeData[`City${image.dataset.id}`].description
    handleTextAnimate(overviewText, 100, 1000)
    
    overviewDescription.classList.remove('animate')
    overviewFindHotels.classList.remove('animate')

    setTimeout(() => {
      overviewDescription.style.opacity = 0;
      overviewFindHotels.style.opacity = 0;
    }, 30);

    setTimeout(() => {
      
      overviewDescription.className += ' animate'
      overviewFindHotels.className += ' animate'
    }, 60);

    setTimeout(() => {
      
      overviewDescription.style.opacity = 1;
      overviewFindHotels.style.opacity = 1;

      image.style.transform = `translateX(0vw) translateY(-20vh) scale(${100/18},${100/(42*0.6)})`

    }, 150);

    const gradient = document.querySelector('.home-image-gradient')
    gradient.style.zIndex = 2
    gradient.style.opacity = '100%'
  
    const overviewContainer = document.querySelector('.home-overview')

    setTimeout(() => {
      overviewContainer.style.zIndex = 2
    }, 1000);

  }
 
 

  function stopAnimation(){
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null
      // setAnimationId(null);
    }
  }
  function handleImageClickReturn(e){
    let currentTime = new Date().getTime();
    if (currentTime - lastClick < 3500) {
        console.log('stopped')
        return
    }
    setLastClick(currentTime)
    
    const image = document.querySelector(`[data-id="${imageTransform.id}"].home-image`)
    if(e.target.className.includes('home-find-hotel-text')){
      const coordinates = HomeData[`City${image.dataset.id}`].coordinates
      navigate('/Search', { state: { coordinates } });
      return
    }
    image.style.transform = imageTransform.transform
    image.style.zIndex = 0

    const overviewContainer = document.querySelector('.home-overview')
    overviewContainer.style.zIndex = -1

    const gradient = document.querySelector('.home-image-gradient')
    gradient.style.opacity = '0%'

    setTimeout(() => {
      image.classList.remove('animate')
      gradient.style.zIndex = -1

    }, 1000);
    setTimeout(() => {
      init(3)
      
    }, 1050);
  }
  function handleTextAnimate(e, speed, delay){
    const cursor = document.querySelector('.typing-cursor-text')
    cursor.style.backgroundColor = 'white'

    const textToType = e.textContent
    const typingSpeed = speed;
    e.textContent = ''
    let currentText = ''
    setTimeout(typeNextLetter, delay); 
    function typeNextLetter() {
      currentText += textToType[currentText.length];
      e.textContent = currentText;
  
      if (currentText.length < textToType.length) {
        setTimeout(typeNextLetter, typingSpeed);
      }
    }
    setTimeout(() => {
    cursor.style.backgroundColor = 'transparent'
    }, delay + 4000);
  }



  async function handleNav(e){
    if(carouselAnimationRunning) return
    if(!e.target.className.includes('home-nav-item') || e.target.className.includes('selected')){
      return
    }
      setCarouselAnimationRunning(true)
      const id = e.target.dataset.id
      const image = document.querySelector(`[data-id="${id}"].home-image`)
      stopAnimation()
      await initNav(100, id)
      stopAnimation()
      init(3)
      setCarouselAnimationRunning(false)
  }

  return (
    <>
      <NavBar color={"white"}></NavBar>

      <div className="home-container">

        <div className="home-background">
          <img src={"/Images/Background4.jpg"} alt="" />
        </div>
        <div onClick={(e) => handleInputExit(e)} className="home-content">
          <div onClick={(e) => handleNav(e)} className="home-nav">
                <div data-id='1' className="home-nav-item"><div className="home-nav-line"></div></div>
                <div data-id='2' className="home-nav-item"><div className="home-nav-line"></div></div>
                <div data-id='3' className="home-nav-item"><div className="home-nav-line"></div></div>
                <div data-id='4' className="home-nav-item selected"><div className="home-nav-line"></div></div>
                <div data-id='5' className="home-nav-item"><div className="home-nav-line"></div></div>
                <div data-id='6' className="home-nav-item"><div className="home-nav-line"></div></div>

          </div>
          <div onClick={(e) => handleImageClick(e.target)} className="home-image-carousel">
            <img data-positionx={-12} data-id='1' className='home-image' src="/Images/City6.webp" alt="" />
            <img data-positionx={7} data-id='2' className='home-image' src="/Images/City8.webp" alt="" />
            <img data-positionx={26} data-id='3' className='home-image' src="/Images/City5.webp" alt="" />
            <img data-positionx={45} data-id='4' className='home-image' src="/Images/City4.webp" alt="" />
            <img data-positionx={96} data-id='5' className='home-image' src="/Images/City7.webp" alt="" />
            <img data-positionx={115} data-id='6' className='home-image' src="/Images/City3.webp" alt="" />
          
          </div>
          <SearchbarHome hover={inputHover}/>
          <div className="home-content-text">
            <div className="home-main-title">Find a Hotel</div>
            <div className="home-description">Are you craving an unforgettable getaway? Mytravelhotel is your one-stop destination for discovering the perfect accommodations for your dream vacation. Whether you're planning a relaxing beach retreat, an adventurous mountain escape, or a luxurious city stay, we've got you covered.</div>
            <div className="home-find-hotels">
              <div className="home-find-hotel-text">Find Hotels</div>
              <div className="home-find-hotel-svg"></div>
            </div>
          </div>
          <div  className="home-image-gradient"></div>

        </div>
        <div onClick={(e) => handleImageClickReturn(e)} className="home-overview">
          <div className="home-overview-text">
            <div className="home-title">
              <div className="overview-title">
              {HomeData.City4.title}
              </div>
              <span className='typing-cursor-text'>a</span>
            </div>
            <div className="home-description overview-description">{HomeData.City4.description}</div>
            <div className="home-find-hotels overview-find-hotels">
              <div className="home-find-hotel-text">Find Hotels</div>
              <div className="home-find-hotel-svg overview-svg"></div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}
