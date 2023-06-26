import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { postData } from '../../apiService/apiService';

const stripePromise = loadStripe('pk_test_51LaajgSGKYaLOMebkgLP3NYYqW3jnDPRzBYSkpctNbLwx2AvLoJ0N8oO21PrC9bNxcRPAXXgIpQ0ecCvRypl0hFo00oke2jAxs');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      lineHeight: "27px",
      color: "#212529",
      fontSize: "1.1rem",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default function CheckoutForm(props) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message,setMessage] =useState('')
    const stripe = useStripe();
    const elements = useElements();
  
    useEffect(() => {
      if (stripe && elements) {
        const cardElement = elements.getElement(CardElement);
        console.log(cardElement);
      }
    }, [stripe, elements]);
  
    const handleSubmit = async (event) => {
      try {
        event.preventDefault();
  
        if (!stripe || !elements || !elements.getElement(CardElement)) {
          console.log(78);
          return;
        }
  
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
            billing_details: {
              name,
              email,
            },
          });
          
          setLoading(false);
          
          if (error) {
            setErrorMsg(error.message);
          } else {
            const intentPay = await postData('stripe/payment', {
              items: [{ shirt: 'x1l' }],
              description: 'ok12',
              shipping: {
                name: name,
                address: {
                  line1: 'chandigarh1',
                },
              },
            });
          const clientSecret=intentPay?.clientSecret
            // Handle the response from the backend API
            const { error, paymentIntent } = await stripe.confirmPayment( {payment_intent_client_secret: clientSecret});
            console.log(error,paymentIntent,78);
              if (error) {
                setMessage(error.message);
              } else if (paymentIntent.status === "succeeded") {
                setMessage("Payment succeeded!");
              } else {
                setMessage("Something went wrong.");
              }
      }
     } catch (error) {
        console.log(error);
      }
    };

  return (<>
      <h4 className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">Pay with card</span>
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="cc-name">Name on card</label>
            <input
              id="cc-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="cc-email">Email</label>
            <input
              id="cc-email"
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="card-element">Card Information</label>
            <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        <hr className="mb-4" />
        <button className="btn btn-dark w-100" type="submit" disabled={loading}>
          {loading ? (
            <div className="spinner-border spinner-border-sm text-light" role="status"></div>
          ) : (
            `PAY $${10}`
          )}
        </button>
        {errorMsg && <div className="text-danger mt-2">{errorMsg}</div>}
      </form>
      </>
  );
}