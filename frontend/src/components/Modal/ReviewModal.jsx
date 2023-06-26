import { Button, Modal ,Form} from 'react-bootstrap';
import React, { useContext, useState } from 'react'
import axios from 'axios';
import {toast} from 'react-toastify'
import {ContextData} from '../../App'
import { FaStar } from 'react-icons/fa';
import './ReviewModal.css'
import { postData } from '../../apiService/apiService';
function ReviewModal() {
    const handleClose = () => {
        setReviewModal(false)
    }
    const [review,setReview]=useState({
        stars:0,reviewText:''
    })
    const {reviewModal,setReviewModal,companyId}=useContext(ContextData)
    const handleReviewSubmit =async ( data)=>{
      try {
        const token =localStorage.getItem('token');
        const payload={reviewData:{...data},airlineCompanyId:companyId}
        const reviewSend=await postData('review',payload)
       if(reviewSend){
        toast.success('review added successfully')
        setReviewModal(false)
       }
      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
    }
  return (
    <div>
     <Modal show={reviewModal} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Add Review</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="stars">
        <Form.Label>Stars:</Form.Label>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={star <= review.stars ? 'star-selected' : 'star-unselected'}
              onClick={() => setReview({ ...review, stars: star })}
            />
          ))}
        </div>
      </Form.Group>
      <Form.Group controlId="reviewText">
        <Form.Label>Review:</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={review.reviewText}
          onChange={(e) => setReview({ ...review, reviewText: e.target.value })}
        />
      </Form.Group>
      <Button variant="primary" onClick={()=>handleReviewSubmit(review)} type="button">
        Submit
      </Button>
    </Form>
  </Modal.Body>
</Modal>

    </div>
  );
};


export default ReviewModal;