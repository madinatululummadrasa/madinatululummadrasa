import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Shared/Navbar/Navbar';
import Footer from '../components/Shared/Footer/Footer';
import QuickContact from '../components/Shared/QuickContact/QuickContact';


const Main = () => {
  const location = useLocation();

  // Match prefixes instead of full path
  const path = location.pathname;

  const hideNavbar = path.startsWith('/dashboard') || path.startsWith('/login') || path.startsWith('/accounts-dashboard');
  const hideQuickContact = path.startsWith('/dashboard')|| path.startsWith('/accounts-dashboard') ; // or add more conditions

  return (
    <div className='leading-relaxed text-base tracking-wide font-bengali min-h-[calc(100vh-68px)]'>
      {!hideQuickContact && <QuickContact />}
   
      {!hideNavbar && <Navbar />}
      <Outlet />
      {!hideNavbar && <Footer />}
    </div>
  );
};

export default Main;
