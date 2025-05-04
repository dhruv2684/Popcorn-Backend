const { body, validationResult } = require("express-validator");

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
      .exists().withMessage("category is required")
      .isArray({ min: 1 }).withMessage("category must be a non-empty array")
      .custom((value) => {
        const invalid = value.filter((cat) => !allowedCategories.includes(cat));
        if (invalid.length) {
          throw new Error(`Invalid category values: ${invalid.join(", ")}`);
        }
        return true;
      }),

    body("downloadLinks").optional().isObject().withMessage("downloadLinks must be an object"),

    body("moviePosterImage")
      .exists().withMessage("moviePosterImage is required")
      .isURL().withMessage("moviePosterImage must be a valid URL"),

    body("movieScreenshotImages").optional().isArray().withMessage("movieScreenshotImages must be an array"),

    body("tags").optional()
      .isArray().withMessage("tags must be an array")
      .custom((value) => {
        const invalid = value.filter((tag) => !allowedCategories.includes(tag));
        if (invalid.length) {
          throw new Error(`Invalid tag values: ${invalid.join(", ")}`);
        }
        return true;
      })
  ];
};

const movieValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = errors.array().map(err => err.msg);
  return res.status(422).json({ message: extractedErrors[0] });
};

module.exports = {
  movieValidationRule,
  movieValidation
};
