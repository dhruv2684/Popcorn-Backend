
const express = require('express');
const router = express.Router();
const MovieController = require('../controller/movieController')
const {
    movieValidationRule,
    movieValidation
} = require('../middleware/movievalidation')
const { adminAuthenticate } = require('../middleware/adminAuthenication')
const upload = require("../middleware/multer");


router.post("/add",
    movieValidationRule,
    movieValidation,
    adminAuthenticate,
    upload.fields([
        { name: "moviePosterImage", maxCount: 1 },
        { name: "movieScreenshotImages", maxCount: 5 }
    ]),
    MovieController.createMovie
);


module.exports = router