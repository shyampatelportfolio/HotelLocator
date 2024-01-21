import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './Css/Home.css'
import './Css/Navbar.css'
import './Css/Misc.css'
import './Css/Checkout.css'
import './Css/HotelSearch/HotelSearchInfo.css'
import './Css/HotelSearch/Filter.css'
import './Css/HotelOverview/Review.css'
import './Css/HotelOverview/FrontImage.css'
import './Css/HotelOverview/HotelRoomGallery.css'



import { Wrapper } from "@googlemaps/react-wrapper";



const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>

    <BrowserRouter>
        <PayPalScriptProvider options={{ "client-id": "AXoE4xbL2Hws30fXG87lxbsupGrXOLpT2rjJPrnB-T4aB4ITrs-pWc3UB-ioVR-SIffpcWTDwi7T3R2l", components: 'marks,buttons' }}>

            <Wrapper 
            apiKey={"AIzaSyD0k860HQHerScESWWENVvopFyYv4LKVqQ"}
            libraries={["places"]}
            >
                <App />
            </Wrapper>
        </PayPalScriptProvider>

    </BrowserRouter>
  </QueryClientProvider>

)
