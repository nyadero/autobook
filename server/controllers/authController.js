const {db} = require("../../connect.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// register user
exports.registerUser = async (req, res, next) => {
    try {
        jwt.verify(req.cookies.jwt, "nodeSocialSecret", (err, decoded) => {
           res.render("register", {title: "Register today",  name: decoded ? decoded.name : null})
        })
    } catch (error) {
         res.render("not-found", {title: "Requested page not found"})
    }
}


// register user on post
exports.registerUserOnPost = async (req, res, next) => {
    try {
    const {name, email, password, confirmpassword} = req.body
    console.log({body: req.body});
    const q = "SELECT * FROM users WHERE email = ?"
    db.query(q, [req.body.email], (err, rows) => {
        if(err) console.log(err.message);
        if(rows[0]){
            console.log({rows});
            req.flash("error_msg", "User already exists")
            return res.redirect("/login")
        }else{
            if(password != confirmpassword) {
                req.flash("error_msg", "Passwords do not match")
                return res.redirect("/register")
            }
            // hash password
            const hashedPassword = bcrypt.hashSync(password, 10)
            // insert query
            const q = "INSERT INTO users (`name`, `email`, `password`) VALUE (?) "
            const values = [name, email, hashedPassword]
            db.query(q, [values], (err, data) => {
                if(err){
                    console.log(err.message);
                    req.flash("error_msg", "Something went wrong")
                    res.redirect("/register")
                }
                if(data){
                    // generate payload
                    // const payload = {name: data[0].name, email: data[0].email, id: data[0].id}
                    // const token = jwt.sign(payload, "nodeSocialSecret", {expiresIn: "2d"})
                    // const cookieOptions = {
                    //     expires: new Date(
                    //         Date.now() + 60000 * 24 * 60 * 60 * 1000
                    //     ),
                    //     httpOnly: true
                    // }

                    // res.cookie("jwt", token, cookieOptions)
                    req.flash("success_msg", "User successfully registered")
                    res.redirect("/")
                }
            })
        }
      
    
    })     
    } catch (error) {
        req.flash("infoErrors", error.message)
        res.redirect("/register")
         res.render("not-found", {title: "Requested page not found"})
    }
}


// login user
exports.loginUser = async (req, res, next) => {
    try {
       jwt.verify(req.cookies.jwt, "nodeSocialSecret", (err, decoded) => {
           res.render("login", {title: "Login today",  name: decoded ? decoded.name : null})
        })
    } catch (error) {
        res.render("not-found", {title: "Requested page not found"})
    }
}

// login user on post
exports.loginUserOnPost = async( req, res, next) => {
    try {
        const {email, password} = req.body
        // find if user exists
        const q = "SELECT * FROM users WHERE email = ?"
        db.query(q, [email], (err, data) => {
            if(err) console.log(err.message);
            if(!data.length){
                req.flash("error_msg", "Incorrect credentials")
                return res.redirect("/login")
            } else{
            console.log({data});
            // compare passwords
            const isPasswordsMatching = bcrypt.compareSync(password, data[0].password)
            if(!isPasswordsMatching) {
                 req.flash("error_msg", "passwords do not match")
                 return res.redirect("/login")
            }else{
                  // generate payload
                    const payload = {name: data[0].name, email: data[0].email, id: data[0].id}
                    const token = jwt.sign(payload, "nodeSocialSecret", {expiresIn: "2d"})
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + 60000 * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                    console.log({token, payload});

                    res.cookie("jwt", token, cookieOptions)
                    req.flash("success_msg", "User successfully logged in")
                    res.status(200).redirect("/")  
            }

            }
        })
    } catch (error) {
        res.render("not-found", {title: "Requested page not found"});
    }
}


// all enthusiasts
exports.allEnthusiasts = async (req, res, next) => {
    try {
        const q = "SELECT * FROM users ORDER BY id DESC"
        db.query(q, [], (err, data) => {
            if(err) console.log(err.message);
            if(data) {
            jwt.verify(req.cookies.jwt, "nodeSocialSecret", (err, decoded) => {
              res.render("enthusiasts", {title: "View all enthasists", data, name: decoded ? decoded.name : null})
            })
            }
        })
    } catch (error) {
        
    }
} 


// enthusiast by id
exports.enthusiast = async (req, res, next) => {
    try {
        const {id} = req.params
        const q = "SELECT * FROM users WHERE id = ?"
        db.query(q, [id], (err, data) => {
            if(err) console.log(err.message);
            if(data) {
                jwt.verify(req.cookies.jwt, "nodeSocialSecret", (err, decoded) => {
                    res.render("enthusiast", {title: `Enthusiast: ${data[0].name}`, data: data[0], name: decoded ? decoded.name : null})
                })
            }
        })
    } catch (error) {
        
    }
}

exports.logOut = async (req, res, next) => {
    res.cookie("jwt", "logout", {
        expires: new Date(Date.now() + 2 * 1000),
		httpOnly: true
    })
    res.clearCookie("jwt")
    res.redirect("/")
}