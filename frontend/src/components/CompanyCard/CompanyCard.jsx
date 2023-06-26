import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import '../Modal/ReviewModal.css'
function CompanyCard({company,setReviewModal,setCompanyId,companyId}) {
    const navigate=useNavigate();
    async function handleClick (){
        setReviewModal(true)
        setCompanyId(company?._id);
    }
    async function handleReviewClick (){
      
      setCompanyId(company?._id);
      navigate(`/companyallreviews`)

  }
    return (
    <Card style={{ width: '18rem' ,margin:'10px' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>{company?.companyName || 'AirOne'}</Card.Title>
        <Card.Text>
          {company?.email || 'AirOne@gmail.com'}
        </Card.Text>
        <Card.Title>{company?.companyCode || 'Air123'}</Card.Title>
        <Form.Group controlId="stars">
        <Form.Label>Stars:</Form.Label>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={star <= company?.stars ? 'star-selected' : 'star-unselected'}
              // onClick={() => setReview({ ...review, stars: star })}
            />
          ))}
        </div>
      </Form.Group>
        <Button style={{margin:'5px'}} variant="primary" onClick={handleReviewClick}>Read reviews</Button>
        <Button style={{margin:'5px'}} variant="primary" onClick={handleClick}>Add review</Button>
      </Card.Body>
    </Card>
  );
}

export default CompanyCard;