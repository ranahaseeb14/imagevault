const mongoose = require("mongoose")
const projSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
        size: {
            type: Number,
        },
        quality: {
            type: Number,
        }
    },
    { timestamps: true }
)
const imageSchema = mongoose.model("imageProj", projSchema)

module.exports = imageSchema
