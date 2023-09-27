import mongoose from "mongoose";
import { Blog, Comment } from "../models/Models.js";


// get blog count 
export const count = async (req, res) => {
  const countt = await Blog.estimatedDocumentCount()
  return res.json(countt)
}

//  get sigle blog 
export const singleBlog = async (req, res) => {
  const blog = await Blog.findOne({_id:req.params.id})
  await blog.populate("author","name")
  res.status(200).send(blog)
}

//  get All blog 
export const allBlog = async (req, res) => {
  const blogs = await Blog.find().populate("author","name").sort({ createdAt: -1 })
  console.log(req)
  res.status(200).json(blogs)
}

// get comments
export const comment=async (req,res)=>{
  const ObjectId = mongoose.Types.ObjectId;
  const obid = new ObjectId(req.params.blogid)
  const comments =await Comment.find({blog:obid}).populate("author","name").select("-blog").sort({ createdAt: -1 })
  res.status(200).json(comments)
}

// get search
export const getSearch = async (req,res)=>{

  let blogs = []
  if(req.body.keyword != "" ) {
    blogs = await  Blog.find().select("title")
  }
  res.status(200).json(blogs)
}

