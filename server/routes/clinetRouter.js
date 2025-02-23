const express=require("express")
const auth=require("../controllers/clientController")
const router=express.Router()
const authmiddleware=require("../middleware/auth")



router.post("/register",auth.register)
router.post("/login",auth.login)
router.delete("/logout",authmiddleware.auth,auth.logout)
router.get("/alluser",authmiddleware.auth,auth.alluser)
router.get("/currentuser",authmiddleware.auth,auth.currentUser)




module.exports=router