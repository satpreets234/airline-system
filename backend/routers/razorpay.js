const Razorpay=require('razorpay');
const router=require('express').Router();
const razorpay =new Razorpay({
    key_id : "rzp_test_hT8Bqf0A2QaCIE",
    key_secret : "prYwq1VgNdabbGwB2fOFV650"
})

module.exports =razorpay;