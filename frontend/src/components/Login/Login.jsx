import React, { useEffect, useState } from 'react';
import { Container,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  Box,
  Avatar, } from '@mui/material';
  import { GoogleLogin } from '@react-oauth/google';
import AirplaneImage from '../../assets/airplane.png';
import './Login.css'; // Import the CSS file
import {  useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { tokenCheck } from '../../common/checkAuth';
import backImage from '../../assets/123.jpg'
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors,setErrors]= useState({});
  const [submit,setSubmit] =useState(false);
  const validateForm = ()=> {
    const {email,password } =formData;
    const errors= {}
    if(!email.trim()){
      errors.email="Email is required"
    }
    if(!password.trim()){
      errors.password="Password is required"
    }
    return errors;
  }
  const navigate=useNavigate();
    useEffect(() => {
      async function checkAuth(){
        const authcheck=await tokenCheck() 
        if(!authcheck){
            navigate('/login')
        }else{
          navigate('/flightdetails')
        }
      }
      checkAuth();
    }, [])
    useEffect(()=>{
      if(submit){
        const errors=validateForm();
        setErrors(errors);
      }
    },[formData,submit])
      const handleLogin =async (payload) => {
        setSubmit(true);
        const errors= validateForm();
        if(Object.keys(errors).length===0){
          try {
            const loginData =await axios.post('http://localhost:8540/api/user/login',{...payload});
            if(loginData.status==200){
              localStorage.setItem('token',loginData?.data?.loginToken)
              toast.success('login successfully');
              navigate('/flightdetails')
            }
          } catch (error) {
            console.log(error);
            if(error?.response?.status===401){
              navigate('/register')
            } else if(error?.response?.status===402){
            }
            toast.error(error?.response?.data);
          }
        }
      };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const responseMessage = (response) => {
    console.log(22);
    console.log(response);
};
const errorMessage = (error) => {
  console.log(11);
    console.log(error);
};
  return (
    <>
    <NavBar/>
    <Container component="main" >
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
        <Typography style={{backgroundColor:'white'}} component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField style={{backgroundColor:'white'}}
            type="email"
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoComplete="email"
            autoFocus
            error={errors.email && submit}
                helperText={errors.email}
          />
          <TextField style={{backgroundColor:'white'}}
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoComplete="current-password"
            error={errors.password && submit}
                helperText={errors.password}
          />
          <Button
            type="button"
            fullWidth
            onClick={()=>{handleLogin(formData)}}
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="forgotpassword" underline='none' variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/" underline='none' variant="body2">
                Don't have an account? Sign Up
              </Link>
              <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    <Footer/>
    </>
  );
};

export default Login;