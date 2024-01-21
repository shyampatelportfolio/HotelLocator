import React, { useEffect, useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import axios from 'axios'
import { useLocation, useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom'
import NavBar from '../Components/Props/NavBar';


export default function Checkout() {
  const [selection, setSelection] = useState(0)
  const [roomData, setRoomData] = useState(["/Images/",0])
  const navigate = useNavigate();
  const { id } = useParams()
  const location = useLocation();
  const receivedDataCoordinates = location.state?.coordinates || {};

  useEffect(() => {
    console.log(receivedDataCoordinates)
    fetchRoomData()
    if(receivedDataCoordinates.success === false){
      const statusContainer = document.querySelector('.checkout-right-status.payment')
      statusContainer.style.opacity = 1
      setTimeout(() => {
        statusContainer.style.opacity = 0
      }, 5000);
    }
  }, [])
  useEffect(() => {
    const checkoutCarousel = document.querySelector('.checkout-form-carousel')
    checkoutCarousel.style.transform = `translateX(-${54*selection}vw)`
    const circles = Array.from(document.querySelectorAll('.checkout-right-nav-item'))
    circles.forEach(x => x.classList.remove('selected'))
    circles[selection].className += ' selected'

    if(selection == 2){
      const res = checkInputs()
      const checkInputContainer = document.querySelector('.check-input-container')
      if(res){
        checkInputContainer.style.display = 'none'
      }
      else{
        checkInputContainer.style.display = 'block'
      }
    }
  }, [selection])


  
  async function fetchRoomData(){
    let url = `${import.meta.env.VITE_APP_API_BASE_URL}/FindHotels/Checkout?roomId=${id}`
    const response1 = await axios.post(url)
    setRoomData([response1.data.image, response1.data.price])
    const paymentButton = document.querySelector('.checkout-summary-button')
    paymentButton.dataset.price = response1.data.price
  }
  function handleCheckoutPayment(e, i){
    const item = e.target.closest('.checkout-payment-item')
    const items = document.querySelectorAll('.checkout-payment-item')
    Array.from(items).forEach(x => x.classList.remove('selected'))
    item.className += ' selected'
    const paypalContainer = document.querySelector('.paypal-container')
    const stripeContainer = document.querySelector('.stripe-container')
    if(i == 0){
      stripeContainer.style.display = 'none'
      paypalContainer.style.display = 'block'
    }else{
      stripeContainer.style.display = 'block'
      paypalContainer.style.display = 'none'
    }
  }
  async function createOrderPayPal(){
    const paymentButton = document.querySelector('.checkout-summary-button')
    const price = Number(paymentButton.dataset.price)
    const res = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/Checkout/Paypal`, {"price" : price})
    return res.data
  }
  function onApprovePayPal(data, actions){
    actions.order.capture().then((details) => {
      navigate('/CheckoutSuccess');
  });
  }
  async function handleStripe(e){
    const reference = e.target.dataset.active
    if(reference == "1"){
      return
    } 
    const paymentButton = document.querySelector('.checkout-summary-button')
    const price = Number(paymentButton.dataset.price)
    e.target.dataset.active = 1
    const res = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/Checkout/Stripe`, {
      "price" : price
    })
    let url = res.data
    window.location = url
    // navigate('/Redirect', { state: { info } });
  }
  function handleInputChange(e, reference){
    let val = e.target.value
    const targ = document.querySelector(`.checkout-summary-item.${reference}`)
    if( reference == 'Name'){
      const items = document.querySelectorAll('.checkout-right-input')
      const a = items[0].value
      const b = items[1].value
      val = a + ' ' + b
    }
    targ.textContent = `${val}`
  }
  function checkInputs(){
    const items = document.querySelectorAll('.checkout-right-input')
    let bool = true
    Array.from(items).forEach(x => {
      if(x.value == '') bool = false
    })
    return bool
  }
  function handleCheckInputMessage(){
    const text = document.querySelector('.checkout-right-status.details')
    text.style.opacity = 1
    setTimeout(() => {
      text.style.opacity = 0
    }, 2000);
  }
  return (
    <>
          <NavBar color={"black"}></NavBar>
    
      <div className="checkout-container" >
        <div className="checkout-right">
          <div className="checkout-right-nav">
            <div className="checkout-right-nav-item selected" onClick={() => setSelection(0)}>
              <div className="checkout-right-nav-item-circle">1</div>
              <div className="checkout-right-nav-item-text">Info</div>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 6L1 11" stroke="black" strokeWidth="2"/>
              </svg>
            </div>
            <div className="checkout-right-nav-item test" onClick={() => setSelection(1)}>
              <div className="checkout-right-nav-item-circle">2</div>
              <div className="checkout-right-nav-item-text">Payment</div>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 6L1 11" stroke="black" strokeWidth="2"/>
              </svg>
            </div>
            <div className="checkout-right-nav-item" onClick={() => setSelection(2)}>
              <div className="checkout-right-nav-item-circle">3</div>
              <div className="checkout-right-nav-item-text">Confirm</div>
            </div>
          </div>
          <div className="checkout-form">
            <div className="checkout-form-carousel">
              <div className="checkout-form-page">
                <div className="checkout-right-title">Information</div>
                <div className="checkout-right-entry-name-container">
                  <div className="checkout-right-entry-name-item">
                    <div className="checkout-right-entry-name">First Name</div>
                    <input onChange={(e) => handleInputChange(e, 'Name')} type="text" className='checkout-right-input small'/>
                  </div>
                  <div className="checkout-right-entry-name-item">
                    <div className="checkout-right-entry-name">Last Name</div>
                    <input onChange={(e) => handleInputChange(e, 'Name')} type="text" className='checkout-right-input small'/>
                  </div>
                </div>
                <div className="checkout-right-entry">Email</div>
                <input onChange={(e) => handleInputChange(e, 'Email')} type="text" className='checkout-right-input'/>
                <div  className="checkout-right-entry">Phone</div>
                <input onChange={(e) => handleInputChange(e, 'Phone')} type="text" className='checkout-right-input'/>
                <div className="checkout-right-entry">Town/City</div>
                <input onChange={(e) => handleInputChange(e, 'Town')} type="text" className='checkout-right-input'/>
                <div className="checkout-right-entry">Postcode</div>
                <input onChange={(e) => handleInputChange(e, 'Postcode')} type="text" className='checkout-right-input last'/>
                <div className="checkout-right-button" onClick={() => setSelection(1)}>Continue</div>
                <div className="checkout-right-status payment">Payment failed, please try again.</div>

              </div>
              <div className="checkout-form-page"></div>
              <div className="checkout-form-page">
                <div className="checkout-right-title">Payment</div>
                
                <div className="checkout-payment-item first selected" onClick={(e) => handleCheckoutPayment(e, 0)}>
                  <div className="checkout-payment-radio-button">
                  </div>
                  <img src="/Images/PayPal.svg.png" alt="" />
                </div>
                <div className="checkout-payment-item second" onClick={(e) => handleCheckoutPayment(e, 1)}>
                  <div className="checkout-payment-radio-button">
                  </div>
                  <img src="/Images/stripe.png" alt="" className='stripe'/>
                </div>
                <div className="checkout-right-button" onClick={() => setSelection(2)}>Continue</div>
              </div>
              <div className="checkout-form-page"></div>
              <div className="checkout-form-page">
                <div className="checkout-right-title">Summary</div>
                <div className="checkout-summary-info">
                  <div className="checkout-left-summary-title">Details</div>
                  <div className="checkout-left-summary-grid">
                    <div className="checkout-left-summary-name">Name:</div>
                    <div className="Name checkout-summary-item">Undefined</div>
                  </div>
                  <div className="checkout-left-summary-grid">
                   <div className="checkout-summary-name">Email:</div>
                    <div className="Email checkout-summary-item">Undefined</div>
                  </div>
                  <div className="checkout-left-summary-grid">
                    <div className="checkout-summary-name">Phone:</div>
                    <div className="Phone checkout-summary-item">Undefined</div>
                  </div>
                  <div className="checkout-left-summary-grid">
                    <div className="checkout-summary-name">Town:</div>
                    <div className="Town checkout-summary-item">Undefined</div>
                  </div>
                  <div className="checkout-left-summary-grid">
                    <div className="checkout-summary-name">Postcode:</div>
                    <div className="Postcode checkout-summary-item">Undefined</div>
                  </div>
                </div>
                <div className="checkout-left-summary-title">Order Summary</div>

                <div className="checkout-left-summary-grid">
                  <div className="checkout-left-summary-name">Price Subtotal:</div>
                  <div className="checkout-left-summary-value">£{roomData[1]}.00</div>
                </div>
                <div className="checkout-left-summary-grid">
                  <div className="checkout-left-summary-name">Tax:</div>
                  <div className="checkout-left-summary-value">£1.00</div>
                </div>
                <div className="checkout-left-summary-grid final">
                  <div className="checkout-left-summary-name final">Order Total:</div>
                  <div className="checkout-left-summary-value final">£{roomData[1] + 1}.00</div>
                </div>
                <div data-price="1" className="checkout-summary-button">
                  Pay Now
                  <div className="paypal-container">
                    <PayPalButtons
                    fundingSource='paypal'
                    createOrder={createOrderPayPal}
                    onApprove={(data, actions) => onApprovePayPal(data, actions)}/>
                  </div>
                  <div className="stripe-container" onClick={handleStripe} data-active="0">

                  </div>
                  <div className="check-input-container" onClick={handleCheckInputMessage}></div>

                </div>
                <div className="checkout-right-status details">Please fill in all details.</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

    </>
  )
}
