import React, { useContext } from 'react'
import "./styles/header.css"
import { Allcontext } from '../Allcontext'
export default function Header() {
  const {nowuser} = useContext(Allcontext)
  return (
    <div className='header'>
        <div className="headername">
            <p className='headermain'>Welcome {nowuser.name.split(" ")}</p>
            <p>Manage your services over here</p>
        </div>
    </div>
  )
}
