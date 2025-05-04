// const bcrypt = require("bcrypt")
// const { generateToken } = require("../service/tokenAuthentication")
const Movie = require("../model/movie")


class MovieController {
    createMovie = async (req, res) => {
        try {
            const {
                movieName,
                releaseDate,
                language,
                category,
                tags,
                downloadLinks // assume it's stringified JSON from FormData
            } = req.body;

            const posterImage = req.files.moviePosterImage?.[0]?.path;
            const screenshotImages = req.files.movieScreenshotImages?.map(file => file.path) || [];

            const parsedCategories = typeof category === "string" ? [category] : category;
            const parsedTags = typeof tags === "string" ? [tags] : tags;

            const parsedDownloadLinks = downloadLinks ? JSON.parse(downloadLinks) : {};

            const movie = await Movie.create({
                movieName,
                releaseDate,
                language,
                category: parsedCategories,
                tags: parsedTags,
                moviePosterImage: posterImage,
                movieScreenshotImages: screenshotImages,
                downloadLinks: parsedDownloadLinks
            });

            return res.status(201).json({
                message: "Movie created successfully",
                movie
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    };


}
module.exports = new MovieController();