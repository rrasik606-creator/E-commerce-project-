import React from 'react'
import Navbar from './components/navbar'
import Approute from './routes/approute'
import Footer from './components/footer'
import { useLocation } from 'react-router-dom'

const App = () => {

  const location=useLocation();

  const hidenavbarfooter=location.pathname==="/login"||location.pathname==="/register";

  return (
    <div>
      {!hidenavbarfooter&&<Navbar/>}
      <Approute/>
      {!hidenavbarfooter&&<Footer/>}
    </div>
  )
}

export default App
