import { User, Blog } from "../models/Models.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).send({ message: result.array() });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" }).end()
    }
    const confirmP = bcrypt.compareSync(req.body.password, user.password)
    if (!confirmP) {
        return res.status(400).json({ message: "Invalid Credentials" }).end()
    }
    const id =  user._id.toString()
    const token = jwt.sign({ id },"SECRET")
    const {password,...details} = user._doc
    return res.status(200).cookie("acessToken", token, {
        httpOnly: true,
        secure: true,
        signed: true,
         //changes secure
        sameSite: "None",
        maxAge: new Date(Date.now() + 700000000),
      }).setHeader("token",token).json({ "message": "user logged in","user":details})
}
export const logout = async (req, res) => {
    res.clearCookie("acessToken").json({mssg:"Logged Out"})
}
export const register = async (req, res) => {
    const salt = bcrypt.genSaltSync(10)
    const secPass = bcrypt.hashSync(req.body.password, salt)
    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(401).json({ "message": result.array() });
    }
    const alreadyExists = await User.findOne({ email: req.body.email })
    if (!alreadyExists) {

        await User.create({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: secPass
        }).catch((error) => res.status(400).json({ "message":error }))
        return res.status(200).json({ "message": "User Created Succesfully" })
    }
    return res.status(409).json({"message":"User already exists"})
}



export const resetPass = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).json({ "message": result.array()});
    }
    const user = await User.findOne({ _id: req.uid })
    if (!user) {
        return res.status(400).json({ message: "user does not exist" }).end()
    }
    const confirmOP = bcrypt.compareSync(req.body.oldPassword, user.password)
    if (!confirmOP) {
        return res.status(400).json({ message: "wrong password" }).end()
    }
    const salt = bcrypt.genSaltSync(10)
    const secPass = bcrypt.hashSync(req.body.newPassword, salt)
    user.password = secPass
    await user.save()
    return res.status(200).json({"message":"password updated successfully"})

}

