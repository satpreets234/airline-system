const { authenticateUserToken } = require('../middleware/auth-middleware');

const router = require('express').Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const billingControllers= require('../controllres/billing-controller')
const createStripeCustomer = async (customerName) => {
    const address = {
        line1: '456 Elm Street',
        line2: 'Apt 2C',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
    };
    return await stripe.customers.create({
        name: customerName, // Customer's name
        address: {
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
        },
    });
}

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1500;
  };

router.post('/address-details',authenticateUserToken,billingControllers.postAddressDetails)
router.get('/billing-details',authenticateUserToken,billingControllers.getBillingDetails)
router.put('/card-details',authenticateUserToken,billingControllers.postCardDetails)

router.post('/payment', async (req, res) => {
    try {
        const { items ,description,shipping} = req.body;
        console.log(req.body);
       const createPayment=await stripe.paymentIntents.create({
        amount:calculateOrderAmount(items),
        currency:'USD',
        description:description,
        shipping: { // Add the customer name and address to the shipping object
            name: shipping.name,
            address: {
              line1: shipping?.address?.line1,
              // Add additional address fields if needed
            },
          },
        automatic_payment_methods:{
            enabled:true
        }
       })
       console.log(createPayment,888);
        res.status(200).send({clientSecret:createPayment.client_secret,paymentIntentId:createPayment.id})
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

})
router.get('/', (req, res) => {
    const paymentIntentId = req.query.payment_intent;
    const paymentIntentClientSecret = req.query.payment_intent_client_secret;
  
    // Retrieve the PaymentIntent from Stripe
    stripe.paymentIntents.retrieve(paymentIntentId)
      .then(paymentIntent => {
        console.log(paymentIntent);
        // Update payment status and perform necessary business logic based on PaymentIntent status
        if (paymentIntent.status === 'succeeded') {
          // Payment succeeded, update your backend accordingly
          res.status(200).send('confirmed');
          // Perform any post-payment actions or fulfill the customer's order
        } else {
          res.status(400).send('not confirmed');
          // Handle other payment statuses (e.g., 'requires_payment_method', 'canceled')
          // You can update your backend state accordingly or take appropriate actions
        }
  
        // Return a response to the frontend confirming the completion of the payment
        // res.json({ success: true });
      })
      .catch(error => {
        // Handle any errors that occurred during the payment retrieval process
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the payment information.' });
      });
  });
router.post("/confirm", async (req, res) => {
    const { paymentIntent, paymentMethod,returnUrl } = req.body;
    try {
      const intent = await stripe.confirmPayment(paymentIntent, {
        payment_method: paymentMethod,
        return_url: returnUrl
      });
  
      /* Update the status of the payment to indicate confirmation */
      res.status(200).json(intent);
    } catch (err) {
      console.error(err);
      res.status(500).json("Could not confirm payment");
    }
  });

module.exports = router;
