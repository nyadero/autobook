const jwt = require("jsonwebtoken");
const { db } = require("../../connect");


const authMiddleware = async(req, res, next) => {
    if(req.cookies.jwt){
       try {
          jwt.verify(req.cookies.jwt, "nodeSocialSecret", (err, decoded) => {
           db.query("SELECT * FROM users WHERE id", [decoded.id], (err, data) => {
            if (err) {
                console.log(err);
                return next()
            }else{
                req.user = data[0]
                return next()
            }
           })
          })
       } catch (error) {
          console.log(err);
          return next()
       }
    }else{
        req.flash("error_msg", "Login first")
        res.redirect("/login")
    }
}

module.exports = {authMiddleware}