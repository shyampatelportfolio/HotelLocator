import { Route, Routes } from "react-router-dom"
import Home from './Pages/Home'
import Overview from './Pages/Overview'
import Checkout from "./Pages/Checkout"
import CheckoutError from "./Pages/CheckoutError"
import CheckoutSuccess from "./Pages/CheckoutSuccess"

import HotelSearchInfo from "./Pages/HotelSearchInfo"
import PageNotFound from './Pages/PageNotFound'
import { useEffect } from "react"

export default function App() {



  return (
    <>
        <Routes>
          <Route path="/" element={<Home/>}>
          </Route>
          <Route path="/Hotel/:id" element={<Overview/>}>
          </Route>
    
          <Route path="/Search" element={<HotelSearchInfo></HotelSearchInfo>}>
          </Route>
          <Route path="/Checkout/:id" element={<Checkout></Checkout>}>
          </Route>
          <Route path="/CheckoutError" element={<CheckoutError></CheckoutError>}>
          </Route>
          <Route path="/CheckoutSuccess" element={<CheckoutSuccess></CheckoutSuccess>}>
          </Route>
          <Route path='*' element={<PageNotFound></PageNotFound>}></Route>

        </Routes>

    </>
  )
}

