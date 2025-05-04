const mongoose = require("mongoose");

const allowedTagsAndCategories = [
  "Action", "Adventure", "Comedy", "Drama", "Horror", "Thriller",
  "Romance", "Science Fiction (Sci-Fi)", "Fantasy", "Animation", "Mystery",
  "Crime", "Family", "Biography", "War", "Western", "Musical",
  "Documentary", "History", "Sports",
  // Adult/Restricted
  "Adult", "18+"
];

const movieSchema = new mongoose.Schema({
  movieName: {
    type: String,
    required: true,
    trim: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  category: [{
    type: String,
    enum: allowedTagsAndCategories,
    required: true
  }],
  downloadLinks: {
    "480p": { type: String },
    "720p": { type: String },
    "1080p": { type: String }
  },
  moviePosterImage: {
    type: String,
    required: true
  },
  movieScreenshotImages: {
    type: [String]
  },
  tags: [{
    type: String,
    enum: allowedTagsAndCategories
  }]
}, {
  timestamps: true
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
