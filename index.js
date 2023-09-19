#!/usr/bin/env node
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

const allowedOrigins = ['writeon-4e1e7.web.app','writeon-4e1e7.firebaseapp.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
    credentials: true,
  
};
//  middle ware
app.use(express.json())

app.use(cors(corsOptions))
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
app.use('/api/authRoutes/',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'writeon-4e1e7.web.app');
  // Add other CORS headers if needed
  next();
},AuthRoutes)
app.use('/api/blogRoutes/',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'writeon-4e1e7.web.app');
  // Add other CORS headers if needed
  next();
},BlogRoutes)
app.use('/api/loggedUser/',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'writeon-4e1e7.web.app');
  // Add other CORS headers if needed
  next();
},LoggedRoutes)
