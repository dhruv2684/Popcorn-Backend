
const express = require('express');
const router = express.Router();
const MovieController = require('../controller/movieController')
const { adminAuthenticate } = require('../middleware/adminAuthenication')
const upload = require("../middleware/multer");


router.post("/add",

    upload.fields([
        { name: "moviePosterImage", maxCount: 1 },
        { name: "movieScreenshotImages", maxCount: 5 }
    ]),
    adminAuthenticate,
    MovieController.createMovie
);
router.get("/", MovieController.getAllMovies);
router.get("/:id", MovieController.getMovieById);
router.delete("/delete/:id", adminAuthenticate, MovieController.deleteMovie);




module.exports = router