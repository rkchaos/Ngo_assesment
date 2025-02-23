const express=require('express')
const router=express.Router()
const {checkout,verify,findTransation,findPercentage}=require("../controllers/paymentController")






router.post("/checkout",checkout)
router.post("/verify",verify)
router.post("/findTrnasation",findTransation)
router.post("/calculatePercentage",findPercentage)










module.exports=router