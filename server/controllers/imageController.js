const cloudinary = require("../config/cloudinary")
const imageSchema = require("../models/imageSchema")
const streamifier = require("streamifier")

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                msg: "No file uploaded"
            })
        }
        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "my_images" },
                    (error, result) => {
                        if (result) resolve(result)
                        else reject(error)
                    }
                )
                streamifier.createReadStream(buffer).pipe(stream)
            })
        }
        const result = await streamUpload(req.file.buffer)

        const newImage = await imageSchema.create({
            name: req.body.name,
            imageUrl: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            size: result.bytes,
        })

        res.status(200).json({ data: newImage })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Upload failed", error: error.message })
    }
}

const updateImage = async (req, res) => {
    try {
        const { id } = req.params
        const { width, height } = req.body

        const update = {}
        if (width !== undefined && width !== null) update.width = width
        if (height !== undefined && height !== null) update.height = height

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ message: "No width or height provided" })
        }

        const updatedImage = await imageSchema.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
        })

        if (!updatedImage) {
            return res.status(404).json({ message: "Image not found" })
        }
        res.json({ data: updatedImage })
    } catch (error) {
        console.error("Update image error:", error)
        res.status(500).json({ message: "Update failed", error: error.message })
    }
}

const getImage = async (req, res) => {
    const data = await imageSchema.find({})
    res.send(data)
}

const getSingleImage = async (req, res) => {
    const singleImage = await imageSchema.findById(req.params.id)
    res.send(singleImage)
}

const deleteImage = async (req, res) => {
    try {
        const image = await imageSchema.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        await cloudinary.uploader.destroy(image.publicId)

        await imageSchema.findByIdAndDelete(req.params.id)

        res.send("Image has been removed")

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
}

const compressImage = async (req, res) => {
    try {
        const { id } = req.params
        const { quality } = req.body

        if (!quality || quality < 1 || quality > 100) {
            return res.status(400).json({ message: "Quality must be between 1 and 100" })
        }

        // Find the original image
        const image = await imageSchema.findById(id)
        if (!image) {
            return res.status(404).json({ message: "Image not found" })
        }

        // Re-upload with quality transformation
        const result = await cloudinary.uploader.upload(image.imageUrl, {
            folder: "my_images",
            quality: quality,
            overwrite: true,
            transformation: [
                { quality: quality }
            ]
        })

        // Update the database with compressed image
        const updatedImage = await imageSchema.findByIdAndUpdate(
            id,
            {
                imageUrl: result.secure_url,
                publicId: result.public_id,
                size: result.bytes,
                quality: quality,
            },
            { new: true }
        )

        res.json({ data: updatedImage })
    } catch (error) {
        console.error("Compress image error:", error)
        res.status(500).json({ message: "Compression failed", error: error.message })
    }
}


module.exports = { uploadImage, getImage, getSingleImage, deleteImage, updateImage, compressImage }