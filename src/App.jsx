import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'  
import About from './pages/About.jsx'
import Home from './pages/Home'
import Products from './pages/Products'



function App() {
  
  const [count, setCount] = useState(0)

  return (
    <Router> {/* Wrap your app content with Router */}
      <div>
        <h1>Hello</h1>
        <Navbar />
        <Routes>
          <Route path='/home' element={<Home/>} />
          <Route path='/about' element={<About />} />
          <Route path='/products' element={<Products />} />  
          <Route path='/products/:productId' element={<Products />} />
        </Routes>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </Router>
  )
}

export default App;