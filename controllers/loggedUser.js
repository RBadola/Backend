import { User, Blog,Comment } from "../models/Models.js";
import { validationResult } from "express-validator";

// create new blog
export const createBlog = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ "message": result.array() })
  }
  const user = await User.findOne({ _id: req.uid}) // get existing user
  if (!user) {
    return res.status(400).json({ message: "Something went wrong" }).end()
  }
  const blog = await Blog.create({ "title": req.body.title, "body": req.body.body }) // create new blog
  // associate blog with user
   blog.author = user
  await blog.save()

  // associate user with blog
  user.blogs.push(blog)
  await user.save()

  // send back blog as response with author populated
  res.status(200).json({ "message": "Blog created Succesfully" })

}
// get blog count 
export const count = async (req, res) => {
  const countt = await Blog.estimatedDocumentCount()
  return res.json(countt)
}

// get posts of logged in person
export const userPosts = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(401).json({ "message": result.array() })
  }
  const posts = await Blog.find({ author: req.uid }).sort({ createdAt: -1 })
  // User.find({_id:req.body.userId}).select("blogs").populate("blogs").sort({ createdAt: -1 })
  res.status(200).json({ posts })
}

//  delete post
export const deletePost = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(401).json({ "message": result.array() })
  }

  const user = await User.findOne({ _id: req.uid }) // get existing user
  if (!user) {
    return res.status(400).json({ message: "Something went wrong" }).end()
  }
  const index =  user.blogs.indexOf(req.params.id);
  if(index < 0){
    return res.status(400).json({ message: "Blog does not exist",index}).end()
  }
  user.blogs.splice(index, 1)
  await user.save()

  await Blog.findOneAndDelete({ _id: req.params.id })
  res.status(200).json({ "message": "deleted successfully" })

}

// create comment 
export const createComment = async (req,res)=>{
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(401).json({ "message": result.array() })
  }
  const user = await User.findOne({ _id: req.uid}) // get existing user
  if (!user) {
    return res.status(400).json({ message: "Something went wrong user" }).end()
  }
  const blog = await Blog.findOne({_id:req.body.blogid})
  if (!blog) {
    return res.status(400).json({ message: "Something went wrong blog" }).end()
  }
  try{

    const comment = await Comment.create({"comment": req.body.comment})
    comment.author = user
    await comment.save()
    comment.blog = blog
    await comment.save()
    
    user.comments.push(comment)
    await user.save()
    
    blog.comments.push(comment)
    await blog.save()
    res.status(200).json({"message":"comment added successfully"})
  }catch(err){
    res.status(400).json({"message":err})
  }
} 