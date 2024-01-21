import Stars from '../Props/Stars'
import ReviewCard from '../Props/ReviewCard'
import ReviewCardItem from '../Props/ReviewCardItem'
import { useEffect, useState, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function Page3({id}) {

    const {data : reviewsData, status, isLoading, refetch } = useQuery({
        queryKey : ['Reviews', id],
        queryFn : () => fetchReviews(id),
    })

    const [selection, setSelection] = useState(null)
    const [rating, setRating] = useState(0)
    const [query, setQuery] = useState([])



    useEffect(() => {
        if(!reviewsData) return
        setQuery(reviewsData.reviews)
        handleRatings()
    }, [reviewsData])
    useEffect(() => {
        if(!reviewsData) return

        let reviewCardContainer = document.querySelector('.person-review-card-wrapper-carousel')
        let textBody = document.querySelector('.person-review-card-wrapper')
        textBody.addEventListener('wheel', handleReviewCardScroll)
        let height1 = reviewCardContainer.scrollHeight
        let height2 = Number(getComputedStyle(textBody).height.slice(0,-2))
        function handleReviewCardScroll(e){
            e.preventDefault()
            let nextPercentage
            if(e.deltaY < 0){
                if(reviewCardContainer.dataset.scroll < -height2) {
                    nextPercentage = height2 + parseFloat(reviewCardContainer.dataset.scroll)
                    textBody.dataset.defer = 0
                }else{
                    textBody.dataset.defer = parseFloat(textBody.dataset.defer) + 1
                    nextPercentage = 0
                }
            }else{
                if(reviewCardContainer.dataset.scroll > -height1 + height2) {
                    textBody.dataset.defer = 0
                    nextPercentage = -height2 + parseFloat(reviewCardContainer.dataset.scroll)

                }else{
                    nextPercentage = -height1 + height2
                    textBody.dataset.defer = parseFloat(textBody.dataset.defer) + 1
                }
            }
            reviewCardContainer.dataset.scroll = nextPercentage
            reviewCardContainer.style.transform = `translateY(${nextPercentage}px)`
        }
        return () => {
            textBody.removeEventListener('wheel', handleReviewCardScroll);
            reviewCardContainer.style.transform = `translateY(0px)`
            reviewCardContainer.dataset.scroll = 0
            textBody.dataset.defer = 0
          }
    }, [selection])
  
    useEffect(() => {
        if(query.length !== 0) setSelection(0)
        
        let button = document.querySelector('.person-review-card-pagination-button')
        if(button !== null){
            button.className += ' selected'
        }
    }, [query])




    async function fetchReviews(hotelId){
        let url = `${import.meta.env.VITE_APP_API_BASE_URL}/FindHotels/ReviewPage?hotelId=${hotelId}`
        const response = await axios.post(url)
        const hotelData = response.data
        return hotelData
    }

    function handleRatings(){
        console.log(reviewsData)
        let sum = reviewsData.reviews.reduce((x,i) =>  x + Number(i.rating), 0)
        let total = reviewsData.reviews.length
        let average = sum / total
        setRating(Math.floor(average*100)/100)
        // let subtitle = document.querySelector('.review-stars-text')
        // subtitle.textContent = `Based on ${total} ratings`

    }
    function handleBars(){
        let total = reviewsData.reviews.length
        let bars = document.querySelectorAll('.review-card-list-item-line-active')
        let percentageText = document.querySelectorAll('.review-card-percentage')
        let percentages = []
        
        bars.forEach((x,i) => {
            let quantity = reviewsData.reviews.filter(x => {
                let rating = Number(x.rating)
                let bool = i + 2 > rating && rating >= i + 1
                if( i == 4){
                    bool = rating == i + 1
                }
                return bool
            })
            percentages[i] = Math.floor(100*quantity.length/total)/100
            if( i == 4){
                let currentSum = percentages.reduce((x,i) => {
                    return x + i}
                    , 0)
                let difference = Math.floor(100*(1 - currentSum))/100
                let maxPercentage = percentages.indexOf(Math.max(...percentages))
                percentages[maxPercentage] += difference
            }
        })
        percentageText.forEach((x,i) => {
            let value = Number((percentages[4-i]*100).toString().slice(0,2))
            x.textContent = `${value}%`
            x.style.opacity = '100%'
        })
        bars.forEach((x,i) => {
            x.style.width = `${percentages[4-i]*100}%`
        })
    }

    function handlerotate(){
        handleBars()
        // let circles = document.querySelectorAll('.border-circle')
        // circles.forEach((x,j) => {
        //     let value = (Object.values(hotel.rating)[j + 1])*125/100
        //     x.style.strokeDashoffset = 125 - value
        // })

    }
    function handleclearrotate(){
        // let circles = document.querySelectorAll('.border-circle')
        // circles.forEach((x,j) => {
        //     x.style.strokeDashoffset = 125
        // })
        let bars = document.querySelectorAll('.review-card-list-item-line-active')
        let percentageText = document.querySelectorAll('.review-card-percentage')
        percentageText.forEach((x,i) => {
            x.style.opacity = '0%'
        })
        bars.forEach((x,i) => {
            x.style.width = `0%`
        })
    }
    function handleSelection(x){
        if(x < 0 || x > Math.ceil(query.length/10) -1) return
        setSelection(x)
        let oldButton = document.querySelectorAll('.person-review-card-pagination-button.reviews.selected')
        if(oldButton.length !== 0){
            oldButton.forEach(x => x.classList.remove('selected'))
        }
        let newButton = document.querySelector(`[data-button="${x}"].reviews`)
        newButton.className += ' selected'
        let buttonCarousel = document.querySelector('.person-review-card-pagination-carousel.reviews')
        buttonCarousel.dataset.position = x
        if(x < 5){
            console.log(123)
            x = 0
        }else{
            x = x-4
        }
        buttonCarousel.style.transform = `translateX(${-x*1.4}vw)`
  
    }
    function handleleft(i){
        let buttonCarousel = document.querySelector('.person-review-card-pagination-carousel.reviews')
        let originalPosition = buttonCarousel.dataset.position
        handleSelection(originalPosition -i)
    }
    function handleChangeItems(e, ref){
        if( ref == 0 ){
            const string = e.target.textContent
            // const stuff = e.target.parentElement.children
            // Array.from(stuff).forEach(x => x.classList.remove('selected'))
            // e.target.className += ' selected'
            let value;
            if( string == "All Ratings"){
                value = -1
            }else{
                value = Number(string.slice(0,1))
            }
            const res1 = filterRating(reviewsData.reviews, value)
            // const item = document.querySelectorAll('.person-review-card-filter-option-dropdown-item.selected')[1]
            // const res = filterDate(res1, item.textContent)
            setQuery(res1)
        }
        if( ref == 1){
            const string = e.target.textContent
            const res1 = filterDate(reviewsData.reviews, string)
            // const item = document.querySelectorAll('.person-review-card-filter-option-dropdown-item.selected')[0]
            // const stuff = e.target.parentElement.children
            // Array.from(stuff).forEach(x => x.classList.remove('selected'))
            // e.target.className += ' selected'
            // const string2 = item.textContent
            // let value;
            // if( string2 == "All Ratings"){
            //     value = -1
            // }else{
            //     value = Number(string2.slice(0,1))
            // }
            // const res = filterRating(res1, value)
            setQuery(res1)
        }
    }
    function filterRating(Array, value){
        const res = Array.filter(x => {
            let bool = false
            if( value == 5){
                if ( x.rating == 5) bool = true
            }else if( value == -1){
                bool = true
            }
            else{
                if ( x.rating >= value && x.rating < value + 1) bool = true
            }
            return bool
        })
        return res
    }
    function adjustDates(date){
        const lastTwo = Number(date.slice(-2)) + 2
        const altLastTwo = date.slice(0,-2)
        const newDate = altLastTwo + `${lastTwo}`
        return newDate  
    }
    function filterDate(Array, string){
        const dateCurrent = new Date()
        const res = Array.filter(x => {
            const newDate = adjustDates(x.date)
            const year = newDate.slice(-4)
            const month = newDate.slice(3,5)
            const day = newDate.slice(0,2)
            const dateString = year + '-' + month + '-' + day
            const datePrev = new Date(dateString)
            const differenceMs = Math.abs(dateCurrent - datePrev);
            const days = differenceMs / (1000 * 60 * 60 * 24);
            let bool = false
            if( string == 'Anytime') bool = true
            if( string == 'This Month'){
                if( days < 31) bool = true
            }
            if( string == 'This Year'){
                const years = days/365
                if( years < 1) bool = true
            }
            return bool
        })
        return res
    }


  return (
    <>
        <div className="section">
            {!isLoading &&
                <div className="review-container">
                    <div className="review-background">
                        <img src={"/Images/City2.jpg"} alt="" />
                    </div>
                    <div  onMouseEnter={handlerotate} onMouseLeave={handleclearrotate} className="review-card">
                        <div className="review-card-background">
                            <img src={reviewsData.hotel.frontImage} alt="" />
                        </div>

                        <div className="review-stars-rating-container">
                            <div className="review-stars-rating">{rating}</div>
                            <div className="review-stars-text-container">
                                <Stars rating={rating} width={16}></Stars>
                                <div className="review-stars-text">Based on {reviewsData.reviews.length} ratings</div>
                            </div>
                        </div>
                        <div className="review-card-list-container">
                            <ReviewCardItem ></ReviewCardItem>
                        </div>
                    </div>
                    
                    <div className="person-review-card-container">
                        <div className="person-review-card-filter">
                            <div className="person-review-card-filter-title">
                                Reviews
                                <div className="person-review-card-filter-subtitle">{query.length}</div>
                            </div>
                            <div className="person-review-card-filter-options">
                                <div className="person-review-card-filter-option">
                                    <div className="person-review-card-filter-option-title">Rating</div>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 9L12 15L6 9" stroke="white" strokeWidth="2"/>
                                    </svg>
                                    <div className="person-review-card-filter-option-dropdown">
                                        <div onClick={(e) =>  handleChangeItems(e, 0)} className="person-review-card-filter-option-dropdown-item selected">All Ratings</div>
                                        <div onClick={(e) =>  handleChangeItems(e, 0)} className="person-review-card-filter-option-dropdown-item">1 Stars</div>
                                        <div onClick={(e) =>  handleChangeItems(e, 0)} className="person-review-card-filter-option-dropdown-item">2 Stars</div>
                                        <div onClick={(e) =>  handleChangeItems(e, 0)} className="person-review-card-filter-option-dropdown-item">3 Stars</div>
                                        <div onClick={(e) =>  handleChangeItems(e, 0)} className="person-review-card-filter-option-dropdown-item">4 Stars</div>
                                        <div onClick={(e) =>  handleChangeItems(e, 0)} className="person-review-card-filter-option-dropdown-item">5 Stars</div>
                                    </div>
                                </div>
                                <div className="person-review-card-filter-option">
                                    <div className="person-review-card-filter-option-title">Date</div>

                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 9L12 15L6 9" stroke="white" strokeWidth="2"/>
                                    </svg>
                                    <div className="person-review-card-filter-option-dropdown">
                                        <div onClick={(e) =>  handleChangeItems(e, 1)} className="person-review-card-filter-option-dropdown-item">This Month</div>
                                        <div onClick={(e) =>  handleChangeItems(e, 1)} className="person-review-card-filter-option-dropdown-item">This Year</div>
                                        <div onClick={(e) =>  handleChangeItems(e, 1)} className="person-review-card-filter-option-dropdown-item selected">Anytime</div>


                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="person-review-card-wrapper" data-defer="0">
                            <div className="person-review-card-wrapper-carousel" data-scroll="0">
                                {query.count !== 0 && selection !== null && query.map((x,i) => {
                                    if(i < 10*(selection+1) && i>= 10*selection){

                                        return <ReviewCard key={i} review={x}></ReviewCard>
                                    }
                                })}
                            </div>
                            
                        </div>
                        <div className="person-review-card-pagination">
                                <div onClick={() => handleleft(1)} className="person-review-card-left-chevron person-chevron">
                                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 1L2 6L6 11" stroke="white" strokeWidth="1"/>
                                    </svg>
                                </div>
                                <div className="person-review-card-pagination-buttons">
                                    <div className="person-review-card-pagination-carousel reviews" data-position="0">
                                        {Array.from({length: Math.ceil(query.length/10)}, (x, i) => (
                                            <div onClick={() =>  handleSelection(i)} key={i} data-button={i} className="person-review-card-pagination-button reviews">{i}</div>
                                        ))}
                                    </div>
    
                                </div>
                                <div onClick={() => handleleft(-1)} className="person-review-card-right-chevron person-chevron">
                                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 6L1 11" stroke="white" strokeWidth="1"/>
                                    </svg>
                                </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    </>
  )
}
