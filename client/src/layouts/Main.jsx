import { Outlet } from 'react-router-dom'
import Navbar from '../components/Shared/Navbar/Navbar'
import Footer from '../components/Shared/Footer/Footer'
import QuickContact from '../components/Shared/QuickContact/QuickContact'
const Main = () => {
  return (
    <div className=' leading-relaxed text-base tracking-wide font-bengali min-h-[calc(100vh-68px)]'>
      <QuickContact></QuickContact>
      <Navbar />
     
        <Outlet />
   
      <Footer />
    </div>
  )
}

export default Main
