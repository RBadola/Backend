import {Router} from "express";
import { createBlog,count ,userPosts,deletePost,createComment} from "../controllers/loggedUser.js";
import {body} from "express-validator"
import AuthMiddleWare from "../middlewares/AuthMiddleware.js";

const router = Router();
router
.post('/createBlog',body("title").trim().notEmpty().withMessage("Title cannot be left empty!"),body("body").trim().notEmpty().withMessage("Body cannot be left empty!"),AuthMiddleWare,createBlog)
.get('/cnt',count)
.post("/myposts",AuthMiddleWare,userPosts)
.post('/deletePost/:id',AuthMiddleWare,deletePost)
.post('/addComment',body("comment").trim().notEmpty().withMessage("Cannot make a empty comment!"),AuthMiddleWare,createComment)
export default router;