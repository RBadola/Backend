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

const allowedOrigins = ['https://writeon-4e1e7.web.app','https://writeon-4e1e7.firebaseapp.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
      // res.status(400).send("Not permitted")
    }
  },
    credentials: true,
  };

//  connect to database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.CONNECT_STRING).then(() => {
    //  listening 
    app.listen(process.env.PORT || 3000,
        () => console.log("connected")
    );
}).catch((err)=>console.log(err))

//  middle ware
app.use(express.json())
app.use(cors())
app.use(cookieParser(process.env.SECRET))

// routes
app.use('/api/authRoutes/',AuthRoutes)
app.use('/api/blogRoutes/',BlogRoutes)
app.use('/api/loggedUser/',LoggedRoutes)
