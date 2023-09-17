import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    blogs: [{
        type: mongoose.Types.ObjectId,
        ref: "Blog"
    }],
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, { timestamps: true })

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    body: {
        type: String,
    },
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    like: {
        type: Number,
        default: 0,
        min: 0
    },
    dislike: {
        type: Number,
        default: 0,
        min: 0
    },
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, { timestamps: true })
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
    },
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    blog: { type: mongoose.Types.ObjectId, ref: "Blog" }
},{ timestamps: true })
export const Blog = mongoose.model("Blog", blogSchema)
export const User = mongoose.model("User", userSchema)
export const Comment = mongoose.model("Comment", commentSchema)