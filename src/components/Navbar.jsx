import React, { useState } from 'react'
import {assets} from '../assets/assets.js'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom'
import '../design/Navbar.css'

const Navbar = () => {

    const [ visible , setVisible] = useState(false);

    

    return ( 
          
     <div className = 'basenavbar' >

        <NavLink onClick={()=>setVisible(false)} className = 'linknavbar' to = '/Home' > Home </NavLink>
        <NavLink onClick={()=>setVisible(false)} className = 'linknavbar' to = '/About' > About </NavLink>
        <NavLink onClick={()=>setVisible(false)} className = 'linknavbar' to = '/Products' > Products </NavLink>
        <NavLink onClick={()=>setVisible(false)} className = 'linknavbar' to = '/Paypal' > Paypal </NavLink>


    </div>  


    )
}

export default Navbar
