import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Formik, Field, ErrorMessage } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { fetchDataWithToken, postData, putData } from '../../apiService/apiService';
import { tokenCheck } from '../../common/checkAuth';
import { useNavigate } from 'react-router-dom';

function BillingDetails() {
  const [userBillingDetails, setUserBillingDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const authcheck = await tokenCheck();
      if (!authcheck) {
        navigate('/login');
      } else {
        navigate('/billing-details');
      }
    }
    checkAuth();
  }, []);
const [state1,setState1] =useState(false)
  const getUserBillingDetails = async () => {
    try {
      const userBillingData = await fetchDataWithToken('stripe/billing-details');
      console.log(userBillingData, 'ppp');
      if (userBillingData) {
       setUserBillingDetails(userBillingData);
       setState1(state1)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserBillingDetails();
  }, [state1]);
  const initialAddressValues = {
    addressLine1: userBillingDetails.addressDetails?.address?.addressLine1 || '',
    addressLine2: userBillingDetails?.addressDetails?.address?.addressLine2 || '',
    state: userBillingDetails?.addressDetails?.state || '',
    city: userBillingDetails?.addressDetails?.city || '',
    postalCode: userBillingDetails?.addressDetails?.postalCode || '',
    country: userBillingDetails?.addressDetails?.country || '',
  };
  console.log(initialAddressValues);

  const addressValidationSchema = Yup.object().shape({
    addressLine1: Yup.string().required('Add address line 1'),
    addressLine2: Yup.string().required('Add address line 2'),
    state: Yup.string().required('Add state name'),
    city: Yup.string().required('Add city name'),
    postalCode: Yup.number().required('Add postal code'),
    country: Yup.string().required('Add country name'),
  });

  const initialCardValues = {
    cardNumber: '',
    expiryDate: '',
    cvvNumber: '',
  };
  
  const cardValidationSchema = Yup.object().shape({
    cardNumber: Yup.number().required('Add Card No.'),
    expiryDate: Yup.date().required('Add Card expiry Date'),
    cvvNumber: Yup.number().required('Add CVV No.'),
  });

  const saveAddressDetails = (values, { setSubmitting }) => {
    try {
      const addressResponse = postData('stripe/address-details', values);
      if (addressResponse) {
        toast.success('address details updated');
        setSubmitting(false);
        getUserBillingDetails();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveCardDetails = (values, { setSubmitting }) => {
    try {
      console.log(values);
      const cardResponse = putData('stripe/card-details', values);
      if (cardResponse) {
        toast.success('card details updated');
        setSubmitting(false);
        getUserBillingDetails();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <Formik
        initialValues={initialAddressValues}
        onSubmit={saveAddressDetails}
        validationSchema={addressValidationSchema}
      >
        {({ isSubmitting, isValid, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <h3>Billing Address</h3>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="addressLine1">
                  <Form.Label>Address Line 1:</Form.Label>
                  <Field
                    type="text"
                    name="addressLine1"
                    placeholder="Enter Address Line 1"
                    className="form-control"
                  />
                  <ErrorMessage name="addressLine1" component="div" className="text-danger" />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="addressLine2">
                  <Form.Label>Address Line 2:</Form.Label>
                  <Field
                    type="text"
                    name="addressLine2"
                    placeholder="Enter Address Line 2"
                    className="form-control"
                  />
                  <ErrorMessage name="addressLine2" component="div" className="text-danger" />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="state">
                  <Form.Label>State:</Form.Label>
                  <Field
                    type="text"
                    name="state"
                    placeholder="Enter State here"
                    className="form-control"
                  />
                  <ErrorMessage name="state" component="div" className="text-danger" />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="city">
                  <Form.Label>City:</Form.Label>
                  <Field
                    type="text"
                    name="city"
                    placeholder="Enter City here"
                    className="form-control"
                  />
                  <ErrorMessage name="city" component="div" className="text-danger" />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="postalCode">
                  <Form.Label>Postal Code:</Form.Label>
                  <Field
                    type="text"
                    name="postalCode"
                    placeholder="Enter Postal Code"
                    className="form-control"
                  />
                  <ErrorMessage name="postalCode" component="div" className="text-danger" />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="country">
                  <Form.Label>Country:</Form.Label>
                  <Field
                    type="text"
                    name="country"
                    placeholder="Enter Country here..."
                    className="form-control"
                  />
                  <ErrorMessage name="country" component="div" className="text-danger" />
                </Form.Group>
              </div>
            </div>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              style={{ marginTop: '20px' }}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Submitting...' : 'Add Address Details'}
            </Button>
          </Form>
        )}
      </Formik>

      <Formik
        initialValues={initialCardValues}
        onSubmit={saveCardDetails}
        validationSchema={cardValidationSchema}
      >
        {({ isSubmitting, isValid, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <h3>Card Details</h3>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="cardNumber">
                  <Form.Label>Card Number:</Form.Label>
                  <Field
                    type="text"
                    name="cardNumber"
                    placeholder="Enter Card Number"
                    className="form-control"
                  />
                  <ErrorMessage name="cardNumber" component="div" className="text-danger" />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="expiryDate">
                  <Form.Label>Expiration Date:</Form.Label>
                  <Field
                    type="Date"
                    name="expiryDate"
                    placeholder="Enter Expiration Date"
                    className="form-control"
                  />
                  <ErrorMessage name="expiryDate" component="div" className="text-danger" />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="cvvNumber">
                  <Form.Label>CVV:</Form.Label>
                  <Field
                    type="text"
                    name="cvvNumber"
                    placeholder="Enter CVV"
                    className="form-control"
                  />
                  <ErrorMessage name="cvvNumber" component="div" className="text-danger" />
                </Form.Group>
              </div>
            </div>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              style={{ marginTop: '20px' }}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Submitting...' : 'Add Card Details'}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default BillingDetails;