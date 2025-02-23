const Razorpay = require('razorpay');
const dotenv = require('dotenv').config()

const instance = new Razorpay({
    key_id: process.env.RAZER_PAY_API_KEY,
    key_secret: process.env.RAZER_PAY_API_SECRET,
});



module.exports = instance








