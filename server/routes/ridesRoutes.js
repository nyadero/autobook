const express = require("express")
const { uploadRidesImages } = require("../middlewares/filesUpload")
const router = express.Router()
const ridesController = require("../controllers/ridesController")
const { authMiddleware } = require("../middlewares/authMiddleware")

// all rides
router.get("/rides", ridesController.getAllRides)

// submit a ride
router.get("/submit-ride", authMiddleware, ridesController.submitRide)

router.post("/submit-ride", authMiddleware , uploadRidesImages, ridesController.submitRideOnPost)

// get single ride
router.get("/ride/:id", ridesController.getRide)



module.exports = router