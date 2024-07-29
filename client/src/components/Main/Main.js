import React, { useState } from 'react'
import './main.css'
import Navbar from '../Navbar/Navbar';

const Main = () => {

  const port = "https://userauth-mvxp.onrender.com"
  const [note, setNote] = useState({ title: "", description: "", date: "" })

  const setval = (e) => {
    const { name, value } = e.target

    setNote(() => {
      return {
        ...note,
        [name]: value
      }
    })
  }

  return (
    <>
      <Navbar />
    </>
  )
}

export default Main
