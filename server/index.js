const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cookieParser = require("cookie-parser")
const clientRouter = require("./routes/clinetRouter")
const cors = require("cors")
const paymantRouter=require("./routes/paymentRoutes")


mongoose.connect(process.env.MONGOURL)
    .then(() => {
        console.log('databse connected')
    })
    .catch((err) => {
        console.log('server error', err)
    })
app.use(cors({
    origin: ["http://localhost:5173","https://ngo-assesment.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(clientRouter)
app.get("/api/getKey",(req,res)=>{
    res.status(200).json({key:process.env.RAZER_PAY_API_KEY})
})
app.use(paymantRouter)







app.listen(8080, () => {
    console.log('Server start at port 8080')
})