require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const port = process.env.PORT
const mongoose = require("mongoose")
const imageRoutes = require("./routes/imageRoutes")
const connectDB = require("./db-configuration/connect")

connectDB()

app.use(express.json())

app.use(cors({ origin: "http://localhost:5173" }))

app.use("/api", imageRoutes)

app.listen(port, () => {
    console.log(`Application is up and running on port ${port}`)
})