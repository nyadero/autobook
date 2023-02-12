const multer = require("multer")

const storage = multer.memoryStorage()

const filesUpload = multer({storage:storage})

let uploadRidesImages = filesUpload.array("images")

module.exports = {uploadRidesImages}