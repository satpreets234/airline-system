import React, { useEffect, useState } from 'react';
import { Typography, Container, TextField, Button, RadioGroup, FormControlLabel, Radio, MenuItem } from '@mui/material';
import Navbar from '../NavBar/NavBar';
import './MainPage.css'
import { tokenCheck } from '../../common/checkAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer/Footer';
import { toast } from 'react-toastify';

const MainPage1 = () => {
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const navigate = useNavigate();

  const [flightQuery, setFlightQuery] = useState({
    from: 'DEL',
    to: 'MAA',
    date: date,
    selectedOption: '',
    passengerCount: '1'
  });

  const [flights, setFlights] = useState([]);

  useEffect(() => {
    async function checkAuth() {
      const authcheck = await tokenCheck();
      if (!authcheck) {
        navigate('/login');
      } else {
        navigate('/flightdetails');
      }
    }
    checkAuth();
  }, []);

  let token = localStorage.getItem('token');
  const[from,setFrom] =useState([])
  const[to,setTo] =useState([])

  useEffect(() => {
    async function getAllFlights() {
      try {
        const flightsDetails = await axios.get('http://localhost:8540/api/flight/flight-details', {
          headers: { authorization: `Bearer ${token}` }
        });
  
  
        if (flightsDetails.status === 200 && flightsDetails.data.length > 0) {
          setFlights(flightsDetails.data);
          const uniqueOrigins = [...new Set(flightsDetails.data.map((flight) => flight.origin))];
          const uniqueDestinations = [...new Set(flightsDetails.data.map((flight) => flight.destination))];
          setFrom(uniqueOrigins)
          setTo(uniqueDestinations)
        }
      } catch (error) {
        toast.error('Please Login!')
        navigate('/login')
      }
    }
    getAllFlights(); 
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate('/searchdetails', { state: flightQuery });

    // Handle form submission
    const flightsDetails = await axios.get(
      `http://localhost:8540/api/flight/flight-details?origin=${flightQuery.from}&destination=${flightQuery.to}&scheduledDate=${flightQuery.date}&selectedOption=${flightQuery.selectedOption}&passengerCount=${flightQuery.passengerCount}`,
      {
        headers: { authorization: `Bearer ${token}` }
      }
    );


    if (flightsDetails.status === 200 && flightsDetails.data.length > 0) {
      setFlights(flightsDetails.data);
     
    }
  };

  return (<>
    <Navbar currentUser={true}/>
    <div className='center'>
        <h2>Flight Search</h2>
      <div className="input-group input-group-lg">
        <Typography variant="subtitle1" className='form-control heading-label'>
          FROM
        </Typography>
        <Typography variant="subtitle1" className='form-control heading-label'>
          TO
        </Typography>
        <Typography variant="subtitle1" className='form-control heading-label'>
          DEPARTURE
        </Typography>
        <Typography variant="subtitle1" className='form-control heading-label'>
          TRAVELLERS
        </Typography>
      </div>
      <div className="input-group input-group-lg">
        <select onChange={(e) => {
           setFlightQuery({ ...flightQuery, from: e.target.value }) }} style={{padding:'10px' ,paddingRight:'110px',paddingLeft:'55px'}}>
          {from.map((origin)=>{ 
          return <option value={origin}>{origin}</option>
})}
          
        </select>
         <select onChange={(e) => {
           setFlightQuery({ ...flightQuery, to: e.target.value }) }} style={{padding:'10px' ,paddingRight:'110px',paddingLeft:'55px'}}>
          {to.map((destination)=>{ 
          return <option value={destination}>{destination}</option>
})}
</select>
        <datalist id="airports">
          {/* {flights.map((flight) => (
            <option key={flight.IATA_code} value={flight.IATA_code}>
              {flight.city_name}
            </option>
          ))} */}
        </datalist>
        <input style={{padding:'10px' ,paddingRight:'70px',paddingLeft:'55px'}}
          type="date"
          aria-label="date"
          value={flightQuery.date}
          name="date"
          onChange={(e) => { setFlightQuery({ ...flightQuery, date: e.target.value }) }}
          required
          inputprops={{ className: 'input-field' }}
        />
        <TextField style={{paddingRight:'110px'}}
          select
          value={flightQuery.passengerCount}
          name="passengerCount"
          onChange={(e) => { setFlightQuery({ ...flightQuery, passengerCount: e.target.value }) }}
          required
          inputProps={{ className: 'input-field' }}
        >
          <MenuItem key='1' value='1'>1</MenuItem>
          <MenuItem key='2' value='2'>2</MenuItem>
          <MenuItem key='3' value='3'>3</MenuItem>
          <MenuItem key='4' value='4'>4</MenuItem>
          <MenuItem key='5' value='5'>5</MenuItem>
          <MenuItem key='6' value='6'>6</MenuItem>
        </TextField>
      </div>
      <div className="bt">
        <form onSubmit={handleSubmit}>
          <RadioGroup
            aria-label="Basic radio toggle button group"
            name="group"
            value={flightQuery.selectedOption}
            onChange={(e) => { setFlightQuery({ ...flightQuery, selectedOption: e.target.value }) }}
            style={{ marginBottom: '1rem' }}
          >
            <FormControlLabel value="Economy" control={<Radio />} label="Economy" />
            <FormControlLabel value="Premium" control={<Radio />} label="Premium" />
            <FormControlLabel value="Business" control={<Radio />} label="Business" />
          </RadioGroup>
          <Button variant="contained" type="submit" className="btn-dark btn-lg button">
            SEARCH
          </Button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default MainPage1;