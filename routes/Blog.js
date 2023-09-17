import {Router} from "express";
import { count,allBlog,singleBlog,comment,getSearch} from "../controllers/blog.js";

const router = Router();
router.get('/blog',allBlog).get('/count',count).get('/blog/:id',singleBlog).get('/getComments/:blogid',comment).post('/search',getSearch)
export default router;