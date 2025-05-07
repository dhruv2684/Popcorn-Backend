const { body, validationResult, check } = require("express-validator");

const allowedCategories = [
  "Action", "Adventure", "Comedy", "Drama", "Horror", "Thriller",
  "Romance", "Science Fiction (Sci-Fi)", "Fantasy", "Animation", "Mystery",
  "Crime", "Family", "Biography", "War", "Western", "Musical",
  "Documentary", "History", "Sports", "Adult", "Erotic", "18+"
];

const movieValidationRule = () => {
  return [
    body("movieName")
      .exists().withMessage("movieName is required")
      .notEmpty().withMessage("movieName cannot be empty"),

    body("releaseDate")
      .exists().withMessage("releaseDate is required")
      .isISO8601().withMessage("releaseDate must be a valid date (YYYY-MM-DD)"),

    body("language")
      .exists().withMessage("language is required")
      .notEmpty().withMessage("language cannot be empty"),

    body("category")
      .exists().withMessage("category is required"),

    body("downloadLinks")
      .optional()
      .custom((value) => {
        // Ensure value is a string before parsing
        if (typeof value === "string") {
          try {
            value = JSON.parse(value); // Parse stringified JSON
          } catch (err) {
            throw new Error("Invalid JSON format for downloadLinks");
          }
        }

        // Now check if it's a valid object
        if (value && typeof value === "object") {
          Object.values(value).forEach(url => {
            if (typeof url !== 'string' || !/^https?:\/\/.+/i.test(url)) {
              throw new Error("Each download link must be a valid URL");
            }
          });
        }
        return true;
      })
      .withMessage("downloadLinks must be a valid object"),


    check("moviePosterImage").custom((_, { req }) => {
      if (!req.files || !req.files.moviePosterImage || !req.files.moviePosterImage.length) {
        throw new Error("moviePosterImage is required");
      }
      return true;
    }),

    check("movieScreenshotImages").optional().custom((_, { req }) => {
      if (req.body.movieScreenshotImages && !req.files.movieScreenshotImages) {
        throw new Error("movieScreenshotImages must be files");
      }
      return true;
    }),

    body("tags")
    .exists().withMessage("tags is required")
  ];
};

const movieValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array()); // Log all errors
    const firstError = errors.array()[0].msg; // Get the first error message
    return res.status(422).json({ message: firstError }); // Return only the first error
  }
  next(); // If validation is successful, continue to the next middleware
};


module.exports = {
  movieValidationRule,
  movieValidation
};
