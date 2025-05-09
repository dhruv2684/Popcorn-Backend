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

            // Handle file uploads for movie poster and screenshots
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

            // Parse category to ensure it is in array format
            // const parsedCategories =
            //     Array.isArray(category) ? category :
            //     typeof category === "string" && category.trim() !== "" ? [category.trim()] :
            //     [];

            // // Ensure at least one category is provided
            // if (parsedCategories.length === 0) {
            //     return res.status(400).json({ message: "At least one category is required" });
            // }

            // // Parse tags to ensure they are in array format
            // const parsedTags =
            //     Array.isArray(tags) ? tags :
            //     typeof tags === "string" && tags.trim() !== "" ? [tags.trim()] :
            //     [];

            // // Ensure at least one tag is provided
            // if (parsedTags.length === 0) {
            //     return res.status(400).json({ message: "At least one tag is required" });
            // }

            // Parse downloadLinks to ensure proper format
            let parsedDownloadLinks = {};
            try {
                parsedDownloadLinks = downloadLinks
                    ? JSON.parse(downloadLinks)
                    : {};

                parsedDownloadLinks = {
                    "480p": parsedDownloadLinks["480p"] || "",
                    "720p": parsedDownloadLinks["720p"] || "",
                    "1080p": parsedDownloadLinks["1080p"] || ""
                };
            } catch (err) {
                return res.status(400).json({ message: "Invalid downloadLinks format" });
            }

            // Create a new movie record in the database
            const movie = await Movie.create({
                movieName,
                releaseDate,
                language,
                category,
                tags,
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









    getMovieById = async (req, res) => {
        try {
            const movieId = req.params.id;
            const movie = await Movie.findById(movieId);

            if (!movie) {
                return res.status(404).json({ message: "Movie not found" });
            }

            res.status(200).json({ movie });
        } catch (error) {
            console.error("Error fetching movie by ID:", error);
            res.status(500).json({ message: "Server error while fetching movie" });
        }
    };


     getAllMovies = async (req, res) => {
        try {
            const searchQuery = req.query.search || "";

            const movies = await Movie.find({
                movieName: { $regex: searchQuery, $options: "i" }
            }).sort({ releaseDate: -1 }); // Sort by release date descending

            // Format releaseDate to yyyy=mm=dd
            const formattedMovies = movies.map(movie => {
                const releaseDate = new Date(movie.releaseDate);
                const formattedDate = releaseDate.getFullYear() + '-' +
                    (releaseDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
                    releaseDate.getDate().toString().padStart(2, '0');
                return {
                    ...movie.toObject(),
                    releaseDate: formattedDate
                };
            });

            res.status(200).json({ movies: formattedMovies });
        } catch (error) {
            console.error("Error fetching movies:", error);
            res.status(500).json({ message: "Server error while fetching movies" });
        }
    };



    deleteMovie = async (req, res) => {
        try {
            const { id } = req.params;

            const deletedMovie = await Movie.findByIdAndDelete(id);

            if (!deletedMovie) {
                return res.status(404).json({ message: "Movie not found" });
            }

            res.status(200).json({ message: "Movie deleted successfully" });
        } catch (error) {
            console.error("Error deleting movie:", error);
            res.status(500).json({ message: "Server error while deleting movie" });
        }
    };








}
module.exports = new MovieController();