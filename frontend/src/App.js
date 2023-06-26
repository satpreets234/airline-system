import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Signup from './components/Signup/Signup2';
import Login from './components/Login/Login';
import Navbar from './components/NavBar/NavBar';
import MainPage1 from './components/MainPage/MainPage1';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import FlightDetails from './components/SearchDetails/SearchDetails';
import FAQPage from './components/Faqs/Faq';
import BookingsPage from './components/Bookings/BookingDetails';
import LandingPage from './components/Home/Home';
import NotFoundPage from './components/NotFound/NotFound';
import CompanyReview from './components/CompanyReview/CompanyReview';
import { createContext, useState } from 'react';
import ReviewReadingPage from './components/ReviewReadingPage/ReviewReadingPage';
import Profile from './components/Profile/Profile';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import EmailCompletionPayment from './components/EmailCompletionPayment/EmailCompletionPayment';
import BillingDetails from './components/BillingDetails/BillingDetails';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './components/CheckoutForm/CheckoutForm';
const stripePromise=loadStripe('pk_test_51LaajgSGKYaLOMebkgLP3NYYqW3jnDPRzBYSkpctNbLwx2AvLoJ0N8oO21PrC9bNxcRPAXXgIpQ0ecCvRypl0hFo00oke2jAxs')
export const ContextData= createContext()
function App() {
  const [reviewModal,setReviewModal] =useState(false);
  const [changePasswordModal,setChangePasswordModal] =useState(false);
  const [profileModal,setProfileModal] =useState(false);
  const [companyId,setCompanyId]=useState('')
  const [user,setUser] =useState({})
  const [clientSecret,setClientSecret] =useState('pi_3NI4IXSGKYaLOMeb1SbVTbPB_secret_Sqv0Ga0GJhbOv92wSXpaeJJ4x')
  return (
    <Elements stripe={stripePromise}>
    <ContextData.Provider value={{reviewModal,setReviewModal,companyId,setCompanyId,
    user,setUser,changePasswordModal,setChangePasswordModal,profileModal,setProfileModal,
    clientSecret,setClientSecret}}>
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/flightdetails' element={<MainPage1/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/searchdetails' element={<FlightDetails/>}/>
        <Route path='/faqs' element={<FAQPage/>}/>
        <Route path='/allBookings' element={<BookingsPage/>}/>
        <Route path='/companyreviews' element={<CompanyReview/>} />
        <Route path='/billing-details' element={<BillingDetails/>} />
        <Route path='/checkout' element={<CheckoutForm/>} />
        <Route path='/companyallreviews' element={<ReviewReadingPage/>} />
        <Route path='/forgotpassword' element={<ForgotPassword/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        <Route path='/complete-payment/:id' element={<EmailCompletionPayment/>} />

        
        <Route path='/*' element={<NotFoundPage/>}/>
       

      </Routes>
      <ToastContainer/>
    </BrowserRouter>
    </ContextData.Provider>
    </Elements>
  );
}

export default App;
