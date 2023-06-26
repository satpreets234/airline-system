const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter, sendMail } = require('../services/node-mail')
const registerTemplate = require('../templates/register-template')
const verifytemplate = require('../templates/successfull-verication');
const razorpay = require('../routers/razorpay');
const stripe1 = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripeFunctions = require('../routers/stripe');
const reviewModel = require('../models/review-model');
const axios = require('axios');
const userModel = require('../models/user-model');
const tokenModel = require('../models/token-model');
const crypto=require('crypto');
const resetPasswordTemplate=require('../templates/reset-pasword');
const successfullPasswordTemplate=require('../templates/reset-password-successfull');
const bookingModel = require('../models/booking-model');
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send('Please provide email and password!')
        } else {
            const alreadyUser = await User.findOne({ email });
            if (alreadyUser) {
                res.status(402).send('Email already exists!')
            } else {
                const razorpayUser = await razorpay.customers.create({ email: email });
                const stripeUser = await stripe1.customers.create({email}   );
                const user = new User({ email, password, customerId: stripeUser.id });
                const userDetails = await user.save();
                if (userDetails) {
                    var link = `${process.env.FRONTEND_SITE_URL}verify?userId=${userDetails._id}`
                    var mailOptions = {
                        from: process.env.NODEMAILER_EMAIL,
                        to: userDetails.email,
                        subject: `Thanks for registering to ${process.env.FRONTEND_SITE_URL}`,
                        html: registerTemplate(userDetails, link)
                    };
                    const mailDetails = await sendMail(transporter, mailOptions, link)
                    if (mailDetails == undefined || mailDetails == null) {
                        res.status(404).send('Mail Not Found !')
                        await User.deleteOne({ _id: userDetails._id });
                    }
                    else {
                        res.status(200).send('Register successfully !')
                    }
                } else {
                    res.status(500).send('Internal server error!')
                }
            }

        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send('Please provide email and password!')
    } else {
        const alreadyUser = await User.findOne({ email });
        if (!alreadyUser) {
            res.status(401).send('Please register first !')
        } else if (alreadyUser && alreadyUser.isVerified == false) {
            res.status(402).send('Please verify your account!')
        } else {
            const passwordMatch = await bcrypt.compare(password, alreadyUser.password);
            if (passwordMatch) {
                const loginToken = jwt.sign({ _id: alreadyUser._id, userType: alreadyUser.userType }, process.env.SECRET_KEY, { expiresIn: '1h' })
                res.status(200).send({ email: alreadyUser.email, loginToken })
            } else {
                res.status(400).send('Bad Credentials !');
            }
        }
    }
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
        res.status(400).send('Please provide oldPassword and newPassword and confirmPassword !')
    }
    else if (newPassword !== confirmPassword) {
        res.status(402).send('newPassword and confirmPassword shoul match!')
    } else {
        const alreadyUser = await User.findOne({ _id: req.user._id });
        if (!alreadyUser) {
            res.status(401).send('Please register first !')
        } else if (alreadyUser && alreadyUser.isVerified == false) {
            res.status(402).send('Please verify your account!')
        } else {
            const passwordMatch = await bcrypt.compare(oldPassword, alreadyUser.password);
            if (passwordMatch) {
                const bcryptedPassword = await bcrypt.hash(newPassword, 10);
                const updatePassword = await userModel.updateOne({ _id: req.user._id }, { password: bcryptedPassword });
                if (updatePassword.modifiedCount > 0) {
                    res.status(200).send('password changed successfully !')
                } else {
                    res.status(404).send('Cannot update!')
                }
            } else {
                res.status(400).send('Bad Credentials !');
            }
        }
    }
}
const profileData = async (req, res) => {
    if (req.user) {
        const alreadyUser = await User.findOne({ _id: req.user._id });
        if (alreadyUser) {
            res.status(200).send(alreadyUser)
        }
    } else {
        res.status(401).send('Unauthorized Access!')
    }
}

const updateProfile = async (req,res) =>{
    try {
        console.log(30);
        console.log(req.file);
        if(req.file!== undefined){
            req.body.userImage=req.file.filename
            const userId=req?.user?._id;
            const updateUser =await userModel.findByIdAndUpdate({_id:userId},req.body)
            if(updateUser.isModified){
                res.status(200).send('Profile image updated successfully!')
            }else{
            }
        }else{
            res.status(404).send("Bad requet")
        }
    } catch (error) {
        res.status(500).send(error)
    }
    
}
const verifyUser = async (req, res) => {
    const { userId } = req.body;
    const alreadyUser = await User.findByIdAndUpdate({ _id: userId }, { isVerified: true }, { new: true, upsert: true });
    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: alreadyUser.email,
        subject: `Thanks for verifying your account`,
        html: verifytemplate(alreadyUser)
    };
    const mailDetails = await sendMail(transporter, mailOptions)
    if (alreadyUser) {
        res.status(200).send("Account Verified successfully !")
    } else {
        res.status(401).send('Unauthorized Access!')
    }
}

const getAllCompanies = async (req, res) => {
    try {
      const allCompanies = await User.find({ userType: 'flightCompany', isVerified: true });
  
      const starsPromises = allCompanies.map(async (company) => {
        const averageStars = await axios.get(`http://localhost:8540/api/review/airline-stars/${company._id}`);
        return averageStars.data[0].averageStars;
      });
  
      const stars = await Promise.all(starsPromises);
  
      const companiesWithStars = allCompanies.map((company, index) => {
        return { ...company._doc, stars: stars[index] };
      });
  
      if (companiesWithStars.length > 0) {
        res.status(200).send(companiesWithStars);
      } else {
        res.status(400).send('No company found');
      }
    } catch (error) {
      res.status(500).send(error);
    }
  };

const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send("User does not exist");
    let token = await tokenModel.findOne({ userId: user._id });
    if (token) await tokenModel.deleteOne({ userId: user._id });
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(10));

    await new tokenModel({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    }).save();
    var link = `${process.env.FRONTEND_SITE_URL}reset-password?token=${resetToken}&id=${user._id}`
    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: `Password change request for ${process.env.FRONTEND_SITE_URL}`,
        html: resetPasswordTemplate(user,link)
    };
    const mailDetails = await sendMail(transporter, mailOptions);
    if (mailDetails == undefined || mailDetails == null) {
        res.status(404).send('Mail Not Found !')
    }
    else {
        res.status(200).send('Reset password link Sent successfully !')
    }
};

const resetPassword = async (req,res) =>{
    const {userId,newPassword,token} =req.body;
    let passwordResetToken = await tokenModel.findOne({ userId });
    if (!passwordResetToken) {
     return res.status(401).send("Invalid or expired password reset token ! Reset password again!");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
    return  res.status(403).send("Invalid or expired password reset token ! Reset password again!");
    }
    const hash = await bcrypt.hash(newPassword, Number(10));
    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
    const user = await User.findById({ _id: userId });
    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: user.email,
        subject: `Password change successful for ${process.env.FRONTEND_SITE_URL}`,
        html: successfullPasswordTemplate(user)
    };
    const mailDetails = await sendMail(transporter, mailOptions);
    if (mailDetails == undefined || mailDetails == null) {
        res.status(404).send('Mail Not Found !')
    }
    else { await passwordResetToken.deleteOne();
        res.status(200).send('Password reset successfull !')
    }
    
}

module.exports = {
    signup, login, profileData, verifyUser, getAllCompanies, changePassword,resetPasswordRequest
    ,resetPassword, updateProfile
}