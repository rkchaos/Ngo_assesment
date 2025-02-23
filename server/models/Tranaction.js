const mongoose = require("mongoose")


const transationSchema = new mongoose.Schema({
    name: {
        type: String,
       
    },
    email: {
        type: String,
       
    },
    referralCode: {
        type: String
    },
    amount: {
        type: String,
        
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    date: {
        type: String,
    
    }
})


const Tranasation = mongoose.model("Tranasation", transationSchema);
module.exports = Tranasation;