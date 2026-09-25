const mongoose = require("mongoose")

function connectDB() {
    mongoose.connect(process.env.IMAGEPROJECTDB).then(() => {
        console.log("✅ DB is connected successfully")
    }).catch(err => {
        console.log("Error in DB connection")
    })
}
module.exports = connectDB