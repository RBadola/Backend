
import jwt from "jsonwebtoken";

const AuthMiddleWare = async (req, res, next) => {
    var token;
    try {
      
        token = req.signedCookies.acessToken
    
    } catch (err) {
        return res.status(400).json({ "error": "Not enc Authenticated" });
    }
    var decoded;
    try {
        decoded = jwt.verify(token,  "SECRET" )
    } catch (err) {
        
        return res.status(400).json({ "error": "Not dec Authenticated" });
    }
    req.uid = decoded.id;
    next();
}


export default AuthMiddleWare