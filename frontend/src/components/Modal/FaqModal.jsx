import { Button, Modal ,Form, Toast} from 'react-bootstrap';
import React, { useState } from 'react'
import axios from 'axios';
import {toast} from 'react-toastify'
function FaqModal({faqModal,setFaqModal}) {
    const handleClose = () => {
        setFaqModal(false)
    }
    console.log(faqModal,setFaqModal,410);
    const [faq,setFaq]=useState({
        question:'',answer:''
    })
    const handleFaqSubmit =async ( data)=>{
      try {
        const token =localStorage.getItem('token');
        const object='64789f7806c318c231f1aed2'
        const faqSend=await axios.post(`http://localhost:8540/api/faq/${object}`,
          data,{headers:{authorization:`Bearer ${token}`}
        });
        if(faqSend.status==200){
          toast.success('faq added')
          setFaqModal(false)
        }
      } catch (error) {
        toast.error(error?.response?.data)
      }
    }
    
  return (
    <div>
        <Modal show={faqModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form >
          <Form.Group controlId="question">
            <Form.Label>Question</Form.Label>
            <Form.Control type="text" placeholder="Enter your question" value={faq.question} onChange={(e)=>{setFaq({...faq,question:e.target.value})}} />
          </Form.Group>
          <Form.Group controlId="answer">
            <Form.Label>Answer</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Enter your answer" value={faq.answer} onChange={(e)=>{setFaq({...faq,answer:e.target.value})}} />
          </Form.Group>
          <Button onClick={()=>{handleFaqSubmit(faq)}} variant="primary" type="button">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
    
    </div>
  )
}

export default FaqModal;