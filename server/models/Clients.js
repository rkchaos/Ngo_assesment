const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")
const dotenv=require('dotenv').config()
const saltRounds = 10;


const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        default:null

    },
    role:{
        type: String,
        enum : ['user','fundraiser'],
        default: 'fundraiser'
    },
    referralCode:{
        type: String

    }
})
clientSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, saltRounds);
    next()
})
clientSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
clientSchema.methods.generateAccessToken = async function () {
    return await jwt.sign(
        { _id: this._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }

    )
}
clientSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }

    )
}
const Client=mongoose.model("Client",clientSchema);
module.exports = Client;