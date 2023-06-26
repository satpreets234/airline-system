import backImage from '../../assets/123.jpg'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    companyName: '',
    companyCode: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const { firstName, lastName, email, password, role, companyName, companyCode } = formData;
    const errors = {};

    // Validate firstName
    if (!firstName.trim()) {
      errors.firstName = 'First Name is required';
    }

    // Validate lastName
    if (!lastName.trim()) {
      errors.lastName = 'Last Name is required';
    }

    // Validate email
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    // Validate password
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password should be at least 6 characters long';
    }

    // Validate role
    if (!role.trim()) {
      errors.role = 'Role is required';
    }

    // Validate companyName if role is flightCompany
    if (role === 'flightCompany' && !companyName.trim()) {
      errors.companyName = 'Company Name is required';
    }

    // Validate companyCode if role is flightCompany
    if (role === 'flightCompany' && !companyCode.trim()) {
      errors.companyCode = 'Company Code is required';
    }

    return errors;
  };
  const [submit,setSubmit] =useState(false);
  useEffect(() => {
    if (isSubmitting) {
      const errors = validateForm();
      setErrors(errors);
    }
  }, [formData, isSubmitting,submit]);

  const navigate = useNavigate();

  const handleSignup = async (payload) => {
    setIsSubmitting(true);
    setSubmit(!submit)
    setErrors({});

    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      try {
        const signupData = await axios.post('http://localhost:8540/api/user/signup', { ...payload });
        if (signupData.status === 200) {
          toast.success('Registered successfully');
          localStorage.setItem('place','india')
          navigate('/login');
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data);
      }
    }
  };

  const showAdditionalFields = formData.role === 'flightCompany';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
        <NavBar/>
        <Container maxWidth="xs">
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* <LockOutlinedIcon /> */}
            </Avatar>
            <Typography style={{ backgroundColor: 'white' }} component="h1" variant="h5">
            Sign up
            </Typography>
            <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    style={{ backgroundColor: 'white' }}
                    autoComplete="fname"
                    name="firstName"
                    required
                    fullWidth
                    label="First Name"
                    autoFocus
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName && isSubmitting}
                    helperText={errors.firstName}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    style={{ backgroundColor: 'white' }}
                    autoComplete="lname"
                    name="lastName"
                    required
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName && isSubmitting}
                    helperText={errors.lastName}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    style={{ backgroundColor: 'white' }}
                    autoComplete="email"
                    name="email"
                    required
                    fullWidth
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email && isSubmitting}
                    helperText={errors.email}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    style={{ backgroundColor: 'white' }}
                    autoComplete="new-password"
                    name="password"
                    required
                    fullWidth
                    type="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password && isSubmitting}
                    helperText={errors.password}
                />
                </Grid>
                <Grid item xs={12}>
                <FormControl style={{ backgroundColor: 'white' }} fullWidth required>
                    <InputLabel>Role</InputLabel>
                    <Select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    error={errors.role && isSubmitting}
                    helperText={errors.role}
                    >
                    <MenuItem value="regular">Regular User</MenuItem>
                    <MenuItem value="flightCompany">Flight Company</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
                {showAdditionalFields && (
                <>
                    <Grid item xs={12}>
                    <TextField
                        style={{ backgroundColor: 'white' }}
                        autoComplete="companyName"
                        name="companyName"
                        required
                        fullWidth
                        label="Company Name"
                        value={formData.companyName}
                        onChange={handleChange}
                        error={errors.companyName && isSubmitting}
                        helperText={errors.companyName}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        style={{ backgroundColor: 'white' }}
                        autoComplete="companyCode"
                        name="companyCode"
                        required
                        fullWidth
                        label="Company Code"
                        value={formData.companyCode}
                        onChange={handleChange}
                        error={errors.companyCode && isSubmitting}
                        helperText={errors.companyCode}
                    />
                    </Grid>
                </>
                )}
            </Grid>
            <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => handleSignup(formData)}
            >
                Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
                <Grid item>
                <Link href="/login" underline='none' variant="body2">
                    Already User? Sign in
                </Link>
                </Grid>
            </Grid>
            </Box>
        </Box>
        </Container>
        <Footer/>
    </>
  );
};

export default SignUp;