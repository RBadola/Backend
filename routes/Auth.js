import {Router} from "express";
import {body} from "express-validator"
import {login,logout,register,updateUser,resetPass} from "../controllers/auth.js"
import AuthMiddleWare from "../middlewares/AuthMiddleware.js";
const router = Router();
const isStrongPassword = (value) => {

  const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*()_+{}\[\]:;<>,.?~\\|\-=/]).*$/;

  return pattern.test(value);
  };
const PasswordChain =()=> body("password").trim().notEmpty().withMessage("Password can not be left empty")
const EmailChain = () => body("email").trim().notEmpty().withMessage("Email can not be left empty").isEmail().withMessage("Email not valid")

router
.post('/login', EmailChain().escape() ,PasswordChain().escape(),login)
.post('/logout',logout)
.post('/register',EmailChain(),
PasswordChain().isLength({min:8}).withMessage("Password length should atleast be 8").isLength({max:12}).withMessage("Password length cannot exceed 12").custom(isStrongPassword).withMessage("Password should contain Numbers, Alphabets and Special Characters").escape()
,register)
.put('/update',body("newname").trim().notEmpty().withMessage("New name can not be left empty"),AuthMiddleWare,updateUser) // private route
.put('/resetPass/',body("oldPassword").trim().notEmpty().withMessage("Old Password is empty"),body("newPassword").trim().notEmpty().withMessage("New Password is empty"),AuthMiddleWare,resetPass)

export default router;