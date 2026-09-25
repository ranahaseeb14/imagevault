const express = require("express")
const upload = require("../middleware/multer")
const { uploadImage, getImage, getSingleImage, deleteImage, updateImage, compressImage } = require("../controllers/imageController")

const router = express.Router()

router.post("/upload", upload.single("image"), uploadImage)

router.get("/images", getImage)

router.get("/image/:id", getSingleImage)

router.delete("/image/:id", deleteImage)

router.patch("/image/:id", updateImage)

router.post("/image/:id/compress", compressImage)


module.exports = router