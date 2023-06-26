import React, { useEffect, useState } from 'react';
import { Container, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@material-ui/core';
import './Faq.css';
import {FcExpand} from 'react-icons/fc'
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import FaqModal from '../Modal/FaqModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchDataWithToken, fetchDataWithoutToken } from '../../apiService/apiService';
const FAQPage = () => {
  const [faqModal,setFaqModal]=useState(false);
  const [faq,setFaqs] =useState([]);
  const [userRole,setUserRole] =useState('regular')
  async function getFaqs (){
    try {
      const data = await fetchDataWithoutToken('faq');
      setFaqs(data);
      const userRole=await fetchDataWithToken('user/profile-data');
      setUserRole(userRole?.userType)
    } catch (error) {
      toast.error(error.message);
    }
    
  }
  useEffect(()=>{
    getFaqs()
  },[])

  const openFaqModal = () =>{
    setFaqModal(true)
  }
  return (
    <Container className="">
      <NavBar/>
      {userRole==='admin'?<Button onClick={openFaqModal} style={{backgroundColor:'skyblue'}}> Add Faq</Button>:''}
      <Typography  variant="h4" className="faq-title">Frequently Asked Questions</Typography>
      {faqModal ? <FaqModal faqModal={faqModal} setFaqModal={setFaqModal}/>:''}
      <div className="faq-accordion">
        {faq[0]?.faqs?.map((item, index) => (
          
          <Accordion key={index}>
            <AccordionSummary expandIcon={<FcExpand/>} className="accordion-summary">
              <Typography variant="h6" className="question">{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" className="answer">{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      <Footer/>
    </Container>
  );
};

export default FAQPage;