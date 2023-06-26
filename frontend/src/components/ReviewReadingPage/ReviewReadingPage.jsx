import React, { useContext, useEffect, useState } from 'react';
import {  fetchDataWithToken } from '../../apiService/apiService'; // Replace with your API fetching function
import {ContextData} from '../../App';
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import './ReviewFile.css'
function ReviewReadingPage() {
  const [reviews, setReviews] = useState([]);
  const {companyId} =useContext(ContextData)
  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await fetchDataWithToken(`review/airline-review/${companyId}`); // Fetch reviews data from your API
        setReviews(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchReviews();
  }, [companyId]);

  return (
    <>
    <NavBar/>
    {reviews.length>0?
    <div className="review-container">
        <h1>Reviews</h1>
        {reviews.map((review) => (
          <div className="review-card" key={review._id.$oid}>
            <h3>Reviewer Name: {review.reviewerId.email}</h3>
            <h3>Airline Company ID: {review.airlineCompanyId.email}</h3>
            <p>Stars: {review.reviewData.stars}</p>
            <p>Review Text: {review.reviewData.reviewText}</p>
          </div>
        ))}
      </div>:<div className='review-container'><h2>No reviews given yet</h2></div>
    }
    <Footer/>
    </>
  );
}

export default ReviewReadingPage;