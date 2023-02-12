const {db} = require("../../connect")
const jwt = require("jsonwebtoken")
const sharp = require("sharp")

exports.getAllRides = async (req, res, next) => {
    try {
        const q = "SELECT r.*, u.name FROM rides as r JOIN users as u ON r.user_id = u.id order by r.id DESC"
        db.query(q, [], (err, data) => {
            if(err) console.log(err.message);
            if(data){
            jwt.verify(req.cookies.jwt, "nodeSocialSecret", (err, decoded) => {
                if(err) console.log(err);
              res.render("rides", {title: "View all rides", data, name: decoded ? decoded.name : null})
            })
            
            }
        })
     } catch (error) {
        
    }
}

// submit a ride
exports.submitRide = async(req, res, next) => {
    try {
        jwt.verify(req.cookies.jwt, "nodeSocialSecret", (err, decoded) => {
            res.render("submit-ride", {title: "Showcase your ride to thousands of enthusiasts", name: decoded ? decoded.name : null})
        })
    } catch (error) {
       console.log(error.message); 
    }
}

exports.submitRideOnPost = async (req, res, next) => {
    try {
       jwt.verify(req.cookies.jwt, "nodeSocialSecret", (err, decoded) => {
        const {make, model, description, yom} = req.body
        console.log({make, model, description, yom});
        let fileNames = []
        // console.log({file: req.files});
        const rideImages = req.files
        // console.log({rideImages});
        rideImages.forEach(image => {
            const newName = Date.now() + image.originalname
            fileNames.push(newName)
            sharp(image.buffer).resize(
                800, 800, { fit: "cover",
            fastShrinkOnLoad: true,
            position: "center",
            quality: 100}
            ).toFile("./public/uploads/" + newName,  (err, info) => {
                if(err) console.log(err.message);
                console.log("shrank");
            })
        });
        const q = "INSERT INTO rides (`make`,`model`, `ride_description`, `yom`, `image1`, `image2`, `image3`, `image4`, `image5`,  `user_id`) VALUE (?) "
        console.log({fileNames});
        const images = fileNames.map(file => file)
        console.log({images});
        const values = [make, model, description, yom, fileNames[0], fileNames[1], fileNames[2], fileNames[3], fileNames[4],  decoded.id,]
        db.query(q, [values], (err, data) => {
             if(err){
                    console.log(err);
                    req.flash("error_msg", "Something went wrong")
                    res.redirect("/submit-ride")
                }
            if(data){
                const imagesQuery = "INSERT INTO images (`ride_id`, `image_url`) VALUES ? "
                const imagesValues = fileNames.map(file => [data.insertId, file])
                console.log({imagesValues});
                // db.query(imagesQuery, [imagesValues], (err, data) => {
                //     if(err) console.log(err);
                //     if(data) {
                        req.flash("success_msg", `${make} added `)
                         res.redirect("/rides") 
                //     }
                // })
            }
        })
        })
    } catch (error) {
        
    }
}

// ride by id
exports.getRide = async (req, res, next) => {
    const {id} = req.params
    try {
        jwt.verify(req.cookies.jwt, "nodeSocialSecret", (err, decoded) => {
          if(err){
            console.log(err);
          } 
          const q = "SELECT * FROM rides WHERE id = ?"
          db.query(q, [id], (err, data) => {
            if(err) console.log(err);
            if(data){
                res.render("ride", {title: `View this ${data[0].make} ${data[0].model}`, data: data[0], name: decoded ? decoded.name : null})
            }
          })
        })
    } catch (error) {
        
    }
}