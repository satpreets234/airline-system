import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Logout } from '../../common/checkAuth';
import { useEffect, useState } from 'react';
import {RxSlash} from 'react-icons/rx';
function NavBar() {
  const [loggedIn,setloggedIn] =useState(false);
  useEffect(()=>{
    const token= localStorage.getItem('token');
    if(token){
      setloggedIn(true);
    }
  },[])
  return (
    <>
      <Navbar bg="dark" variant="dark" style={{marginBottom:'30px'}}>
        <Container>
          <Navbar.Brand href="/">GoAir</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/flightdetails">Flights</Nav.Link>
            <Nav.Link href="/allbookings">Bookings</Nav.Link>
            <Nav.Link href="/faqs">Query</Nav.Link>
            <Nav.Link href="/companyreviews">Give Review</Nav.Link>
            <Nav.Link href="/billing-details">Add billing</Nav.Link>

          </Nav>
          {
            loggedIn?<><Navbar.Brand href="/profile">Profile</Navbar.Brand>
            <Navbar.Brand onClick={Logout} href="/login">Logout</Navbar.Brand></>:
            <>
            <Navbar.Brand href="/login">Login</Navbar.Brand>
            <RxSlash style={{color:'white'}}/>
            <Navbar.Brand href="/register">Register</Navbar.Brand>
            </>
          }
          
        </Container>
      </Navbar>
</>
  );
}

export default NavBar;