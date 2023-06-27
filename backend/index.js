const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path =require('path')
const userRouter = require("./routers/user-routers");
const flightRouter = require("./routers/flight-router");
const bookingRouter = require("./routers/booking-router");
const paymentRouter = require('./routers/payment-router');
const faqRouter = require('./routers/faq-router');
const transactionRouter = require('./routers/transaction-router');
const reviewRouter= require('./routers/review-router');
const stripeRouter= require('./routers/stripe');

const app = express();
const { connection } = require('./connection/mongo-connection');
const cronJobs=require('./crons/payment-cron')
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connection()
app.use("/api/user", userRouter);
app.use("/api/migration", require('./routers/migration-router'));
app.use("/api/flight", flightRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/faq", faqRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/review", reviewRouter);
app.use("/api/stripe", stripeRouter);


const port = 8540;
app.listen(port, () => console.log(`Listening on port ${port}...`));