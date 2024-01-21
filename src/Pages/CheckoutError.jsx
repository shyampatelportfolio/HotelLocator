import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

export default function CheckoutError() {
  const navigate = useNavigate();

  useEffect(() => {
    let coordinates = {
      "success" : false
    }
    navigate('/Checkout/1', { state: { coordinates } });

  }, [])
  return (
    <>
    </>
  )
}
