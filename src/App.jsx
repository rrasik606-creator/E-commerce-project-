import React from 'react'
import Navbar from './components/navbar'
import Approute from './routes/approute'
import Footer from './components/footer'
import { useLocation } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'

const App = () => {

  const location=useLocation();

  const hidenavbarfooter=location.pathname==="/login"||location.pathname==="/register"||location.pathname.startsWith("/admin");

  return (
    <div>
      <Toaster position='top-right'/>
      {!hidenavbarfooter&&<Navbar/>}
      <div className={!hidenavbarfooter ? "pt-[130px]" : ""}>
      <Approute/>
      </div>
      {!hidenavbarfooter&&<Footer/>}
    </div>
  )
}

export default App
