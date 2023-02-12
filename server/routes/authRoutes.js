const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")


// register route
router.get("/register", authController.registerUser)
router.post("/register", authController.registerUserOnPost)

// login route
router.get("/login", authController.loginUser)
router.post("/login", authController.loginUserOnPost)


// all users
router.get("/enthusiasts", authController.allEnthusiasts)

// user by id
router.get("/enthusiast/:id", authController.enthusiast)

// log out user
router.get("/logout", authController.logOut)

module.exports = router