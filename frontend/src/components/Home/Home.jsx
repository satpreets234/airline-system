import React from 'react';
import { Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AirImg from '../../assets/123.jpg'
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
const LandingPage = () => {
  const navigate = useNavigate();

  const handleExploreFlights = () => {
    navigate('/flightdetails');
  };

  return (<>
    <NavBar/>
    <Container maxWidth="md" sx={{ paddingTop: '20vh', paddingBottom: '10vh' }}>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
            Welcome to Flight Booking
          </Typography>
          <Typography variant="h5" component="h2" color="text.secondary" sx={{ marginTop: 2 }}>
            Find the best flights for your next adventure
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginTop: 4 }}
            onClick={handleExploreFlights}
          >
            Explore Flights
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            src={AirImg}
            alt="Flight Booking"
            style={{ width: '100%', height: 'auto' }}
          />
        </Grid>
      </Grid>
    </Container>
    <Footer/>
    </>
  );
};

export default LandingPage;