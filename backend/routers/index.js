const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path =require('path')
const userRouter = require("./user-routers");
const flightRouter = require("./flight-router");
const bookingRouter = require("./booking-router");
const paymentRouter = require('./payment-router');
const faqRouter = require('./faq-router');
const transactionRouter = require('./transaction-router');
const reviewRouter= require('./review-router');
const stripeRouter= require('./stripe');

const app = express.Router();
app.use("/api/user", userRouter);
app.use("/api/migration", require('./migration-router'));
app.use("/api/flight", flightRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/faq", faqRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/review", reviewRouter);
app.use("/api/stripe", stripeRouter);

module.exports= app;