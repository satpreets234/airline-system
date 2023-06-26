import React from 'react';
import { Container, Typography, Link } from '@mui/material';
import {AiOutlineLinkedin,AiOutlineFacebook,AiOutlineInstagram} from 'react-icons/ai'
import {CiTwitter} from 'react-icons/ci'
import {TfiEmail} from 'react-icons/tfi'
import {BsFillTelephoneFill} from 'react-icons/bs'
const Footer = () => {

  return (
    <footer className="bg-dark">
    <div className="footer-content">
        <ul className="socials">
            <li><a href="https://in.linkedin.com/?original_referer="><AiOutlineLinkedin style={{ fontSize: '24px', color: 'white' }}/></a></li>
            <li><a href="https://www.facebook.com/"><AiOutlineFacebook style={{ fontSize: '24px', color: 'white' }}/></a></li>
            <li><a href="https://twitter.com/i/flow/login"><CiTwitter style={{ fontSize: '24px', color: 'white' }}/></a></li>
            <li><a href="https://www.instagram.com/?hl=en"><AiOutlineInstagram style={{ fontSize: '24px', color: 'white' }}/></a></li>
            <li><a href="mailto:satpreet410@gmail.com?subject=Query%20Regarding&body=Flight%20Booking">
              <TfiEmail style={{ fontSize: '22px', color: 'white' }}/>
             </a></li>
             <li><a href="tel:+1243515353">
              <BsFillTelephoneFill style={{ fontSize: '21px', color: 'white' }} />
            </a></li></ul>
    </div>
    
    <div className="footer-bottom text-white">
        <h5 style={{color: "white"}}>GoAir © {new Date().getFullYear() }</h5>
    </div>
</footer>
  );
};

export default Footer;