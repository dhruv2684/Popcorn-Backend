const Movie = require("../model/movie")
const cloudinary = require("../config/cloudinaryConfig");
const streamifier = require("streamifier"); // for uploading buffer to cloudinary

const uploadToCloudinary = (fileBuffer, folderPath) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folderPath // Example: "PopCorn Movie/movie_posters"
            },
            (error, result) => {
                if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};


class MovieController {

    createMovie = async (req, res) => {
        try {
            const {
                movieName,
                releaseDate,
                language,
                category,
                tags,
                downloadLinks
            } = req.body;

            const posterFile = req.files.moviePosterImage?.[0];
            const screenshotFiles = req.files.movieScreenshotImages || [];

            // Poster image folder inside "PopCorn Movie"
            const posterImage = posterFile
                ? await uploadToCloudinary(posterFile.buffer, "PopCorn Movie/movie_posters")
                : null;

            // Screenshot images inside "PopCorn Movie"
            const screenshotImages = await Promise.all(
                screenshotFiles.map(file =>
                    uploadToCloudinary(file.buffer, "PopCorn Movie/movie_screenshots")
                )
            );


            const parsedCategories = typeof category === "string" ? [category] : category;
            const parsedTags = typeof tags === "string" ? [tags] : tags;

            let parsedDownloadLinks = {};
            try {
                parsedDownloadLinks = downloadLinks ? JSON.parse(downloadLinks) : {};
            } catch (err) {
                return res.status(400).json({ message: "Invalid downloadLinks format" });
            }

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
            console.error("Error in createMovie:", error);
            return res.status(500).json({ message: error.message });
        }
    };



}
module.exports = new MovieController();