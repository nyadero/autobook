const {db} = require("../../connect")
const jwt = require("jsonwebtoken")

// home page
exports.homePage = async (req, res, next) => {
    try {
        jwt.verify(req.cookies.jwt, "nodeSocialSecret", (err, decoded) => {
           res.render("index", {title: "Like my rides",  name: decoded ? decoded.name : null})
        }) 
     } catch (error) {
        res.render("not-found", {title: "Requested page not found"})
    }
}