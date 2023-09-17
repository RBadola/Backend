import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoutes from './routes/Auth.js'
import BlogRoutes from './routes/Blog.js'
import LoggedRoutes from './routes/LoggedUser.js'

import cors from "cors"
import cookieParser from "cookie-parser";

//  connect app
const app = express()

//  env file
dotenv.config()

//  middle ware
app.use(express.json())
app.use(cors({origin:true,credentials:true}))
app.use(cookieParser(process.env.SECRET))

//  connect to database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.CONNECT_STRING).then(() => {
    //  listening 
    app.listen(process.env.PORT || 3000,
        () => console.log("connected")
    );
}).catch((err)=>console.log(err))


// routes
app.use('/api/authRoutes/',AuthRoutes)
app.use('/api/blogRoutes/',BlogRoutes)
app.use('/api/loggedUser/',LoggedRoutes)