import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useHistory, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
   navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: '20vh', textAlign: 'center' }}>
      <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
        404 Not Found
      </Typography>
      <Typography variant="h5" component="h2" color="text.secondary" sx={{ marginTop: 2 }}>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" color="primary" size="large" sx={{ marginTop: 4 }} onClick={handleGoBack}>
        Go Back
      </Button>
    </Container>
  );
};

export default NotFoundPage;