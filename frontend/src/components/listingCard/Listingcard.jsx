import React, { useState } from 'react';
import { Card, CardContent, Grid, Typography, Button, FormControl, InputLabel,CardActions, Select, MenuItem } from '@material-ui/core';
import StripeCheckout from 'react-stripe-checkout';
import { postData } from '../../apiService/apiService';

function Listingcard({ detail, handleBooking }) {
  const { flightName, scheduledDate, seatsAvailable } = detail;
  const [ticketCount, setTicketCount] = useState(0);
  const [ticketType, setTicketType] = useState("Economy");
const publishableKey='pk_test_51LaajgSGKYaLOMebkgLP3NYYqW3jnDPRzBYSkpctNbLwx2AvLoJ0N8oO21PrC9bNxcRPAXXgIpQ0ecCvRypl0hFo00oke2jAxs'

  const handleTicketCountChange = (count) => {
    if (count >= 0) {
      setTicketCount(count);
    }
  };

  const payNow =async token =>{
    try {
      const response=await postData(`stripe/payment`,{amount:100*100,token});
      if(response){
        console.log('Successfull payment');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Card className="right-card">
      <CardContent>
        <Typography variant="h4">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Flight Name:
              </Typography>
              <Typography variant="body1">{flightName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Date:
              </Typography>
              <Typography variant="body1">{scheduledDate?.slice(0, 10)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Seat Type:
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="ticket-type-label">Select Seat Type</InputLabel>
                <Select
                  labelId="ticket-type-label"
                  id="ticket-type-select"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                >
                  {seatsAvailable?.map((seatDetail) => (
                    <MenuItem key={seatDetail.type} value={seatDetail.type}>
                      {seatDetail.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Ticket Count:
              </Typography>
              <div className="ticket-count d-flex">
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleTicketCountChange(ticketCount - 1)}
                >
                  -
                </Button>
                <Typography variant="body1" style={{margin:'10px'}} className="count-display">
                  {ticketCount}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleTicketCountChange(ticketCount + 1)}
                >
                  +
                </Button>
              </div>
            </Grid>
          </Grid>
        </Typography>
      </CardContent>
      <CardActions>
      <Button
          variant="contained"
          color="primary"
          onClick={() => handleBooking({...detail,ticketCount,ticketType})}
          disabled={ticketCount <= 0}
        >
          BOOK NOW
        </Button>
      </CardActions>
    </Card>
  );
}

export default Listingcard;