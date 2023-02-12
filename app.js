const express = require("express")
const expressLayout = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
const {db} = require("./connect")
require("dotenv").config()

const app = express()

const PORT = process.env.PORT || 8040

// midddlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(expressLayout)

app.use(cookieParser("likeMyRideSecure"))
app.use(session({
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge: 60000},
    secret: "likeMyRideSecret"
}))
app.use(flash())
app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})


// views
app.set("layout", "./layout/main")
app.set("view engine", "ejs")


// routes
// home page
// app.get("/", (req, res) => res.render("/"))
app.use("/", require("./server/routes/homeRoutes.js"))
app.use("/", require("./server/routes/authRoutes"))
app.use("/", require("./server/routes/ridesRoutes"))

db.connect((err) => {
    if (err) {
        console.log(err.message);
    }else{
        console.log("Successful connection");
    }
})

app.listen(PORT, () => {
    console.log('====================================');
    console.log(`app running on http://localhost:${PORT}`);
    console.log('====================================');
})