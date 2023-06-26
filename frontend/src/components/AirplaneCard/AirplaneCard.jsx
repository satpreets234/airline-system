import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function MediaCard({flightData ,handleBooking}) {
    const navigate=useNavigate()
    if(flightData){
        return (
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image="/static/images/cards/contemplative-reptile.jpg"
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
             {flightData.flightName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flightData?.scheduledDate?.slice(0,10)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={()=>{handleBooking(flightData)}}>Book</Button>
                <Button size="small" onClick={()=>{navigate('/flightdetails')}}>Search Again</Button>
              </CardActions>
            </Card>
          );
    }else{
        return (
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image="../../assets/1.avif"
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  No flight Found !
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Search Again Like Delhi To Sydney!
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={()=>{navigate('/flightdetails')}}>Back</Button>
                <Button size="small" onClick={()=>{navigate('/faqs')}}>Learn More</Button>
              </CardActions>
            </Card>
          );
    }
  
}
