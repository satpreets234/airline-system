import React, { useContext, useEffect, useState } from 'react';
import { Typography, Container, Card, CardHeader, CardContent, CardActions, Button, Grid, InputLabel, Select } from '@material-ui/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../App.css'
import { tokenCheck } from '../../common/checkAuth';
import axios from 'axios';
import MediaCard from '../AirplaneCard/AirplaneCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormControl, MenuItem } from '@mui/material';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import Listingcard from '../listingCard/Listingcard';
import { fetchDataWithToken, postData } from '../../apiService/apiService';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import { ContextData } from '../../App';
const stripePromise = loadStripe('pk_test_51LaajgSGKYaLOMebkgLP3NYYqW3jnDPRzBYSkpctNbLwx2AvLoJ0N8oO21PrC9bNxcRPAXXgIpQ0ecCvRypl0hFo00oke2jAxs');
const FlightDetails = ({ details }) => {
  const place=localStorage.getItem('place');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const navigate = useNavigate();
  const location = useLocation();
  const flightQuery = location.state || JSON.parse(localStorage.getItem('searchParams'));
  localStorage.removeItem('searchParams')
  localStorage.setItem('searchParams', JSON.stringify(flightQuery))
  
  const [flights, setFlights] = useState([]);
  useEffect(() => {
    async function checkAuth() {
      const authcheck = await tokenCheck()
      if (!authcheck) {
        navigate('/login')
      } else {
        navigate('/searchdetails')
      }
    }
    checkAuth();
  }, [])
  let token = localStorage.getItem('token');
  const [sortOrder, setSortOrder] = useState('ao')
  useEffect(() => {
    async function getAllFlights() {
      const flightsDetails = await axios.get(
        `http://localhost:8540/api/flight/flight-details?origin=${flightQuery.from}&destination=${flightQuery.to}&scheduledDate=${flightQuery.date}&selectedOption=${flightQuery.selectedOption}&passengerCount=${flightQuery.passengerCount}&sortBy=${sortOrder}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      if (flightsDetails.status == 200 && flightsDetails.data.length > 0) {
        setFlights(flightsDetails.data)

      }
    }
    getAllFlights()
  }, [sortOrder])
  const {clientSecret,setClientSecret} =useContext(ContextData)
  const [billingDetails,setBillingDetails] =useState('')
  useEffect(() => {
    async function getBillingUserDetails() {
      const userDetails = await fetchDataWithToken('stripe/billing-details')
      if (userDetails) {
        setBillingDetails(userDetails);

      }
    }
    getBillingUserDetails()
  }, [])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
console.log(billingDetails,"billing");
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const initPayment = (data) => {
    console.log(data, 6666);
    const options = {
      key: "rzp_test_hT8Bqf0A2QaCIE",
      amount: data.amount ,
      currency: data.currency,
      description: "Test Transaction",
      order_id: data.id,
      notes: {
        bookingId: data?.notes?.bookingId, // Replace with the actual booking ID
      },
      handler: async (response) => {
        try {
          const payload = {
            ...response,
            notes: {
              bookingId: data?.notes?.bookingId,
            },
          };
          console.log(payload, 1234);
          const verifyUrl = "http://localhost:8540/api/payments/verify";
          const verifyResponse = await axios.post(verifyUrl, payload);
          if (verifyResponse.status == 200) {
            toast.success('Booking done successfully')
            navigate('/allbookings');
          }
        } catch (error) {
          toast.error(error)
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };
  // const [ticketCount, setTicketCount] = useState(1);
  // const [ticketType, setTicketType] = useState('Economy');
  const handleBooking = async (flightData) => {
    try {
      if(place== 'india'){
        console.log(99);
        const token = localStorage.getItem('token');
        const orderUrl = "http://localhost:8540/api/booking/";
        const { seatsAvailable } = flightData;
      const selectedSeat = seatsAvailable.find(seat => seat.type === flightData.ticketType);
      
        const payload = {
          ...flightData, flightId: flightData._id,
          amount: {
            price: !flightData?.ticketCount ?flightData?.ticketType?.seatDetail?.priceDetail * 1 * 100 :
            selectedSeat?.seatDetail?.priceDetail * flightData?.ticketCount * 100,
            currency: "INR"
          },
          seatDetails: {
            seatType: !flightData?.ticketType ? "Economy" : flightData?.ticketType,
            seatCount: !flightData?.ticketCount ? 1:flightData.ticketCount
          },
        }
        delete payload._id;
        const apiData = await axios.post(orderUrl, {
          ...payload
        },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        if (apiData.status == 201 ) {
          toast.success('booking Done kindly complete the payment')
          initPayment(apiData.data);
          const transactionPayload=apiData.data;
          const storeTransaction =await postData('transaction',{...transactionPayload ,orderId:transactionPayload?.id,bookingId:transactionPayload?.notes?.bookingId})
          
        }
     
      } else{
        const stripeLib=await stripePromise;
        const stripePaymentIntent=await postData('stripe/payment', { items: [{ id: "xl1-tshirt" }] })
        console.log(stripePaymentIntent);
        setClientSecret(stripePaymentIntent?.clientSecret)
        if(true){
          console.log(23);
          // navigate('/checkout')
          // <CheckoutForm amount={200}/>
        }
        return null;
      }
        
    } catch (error) {
      toast.error(error)
      console.log(error);
    }
  }
  return (
    <>
      <NavBar/>
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <MediaCard flightData={flights[0] ? flights[0] : ''} handleBooking={handleBooking} />
        </Grid>
        <Grid item xs={12} md={8}>

          {flights?.map((detail) => 
            {
           return (
            <Listingcard   detail={detail}  handleBooking={handleBooking}/>
          )})}
        </Grid>
      </Grid>
      {<Elements stripe={stripePromise}>
          <CheckoutForm/>
        </Elements>
          }
    </Container>
    <Footer/>
    </>
  );
};

export default FlightDetails;