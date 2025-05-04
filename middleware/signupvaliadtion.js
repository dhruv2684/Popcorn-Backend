const { body, validationResult } = require("express-validator")

const signupvalidationRule = () => {
  return [
    body("firstName")
      .exists()
      .withMessage("firstname is required")
      .notEmpty()
      .withMessage("firstname name cannot be empty"),

    body("lastName")
      .exists()
      .withMessage("lastName is required")
      .notEmpty()
      .withMessage("lastName  cannot be empty"),

    body("emailAddress")
      .exists()
      .withMessage("emailAddress is required")
      .isEmail()
      .withMessage("emailAddress is not valid")
      .notEmpty()
      .withMessage("emailAddress cannot be empty"),

    body("phoneNumber")
      .exists()
      .withMessage("phoneNumber  is required")
      .isNumeric()
      .withMessage("phoneNumber  is not type  number")
      .isLength({ min: 10, max: 10 })
      .withMessage("phoneNumber  is must be  10 digit"),

    body("password")
      .exists()
      .withMessage("password is required")
      .notEmpty()
      .withMessage("password cannot be empty")
      .isLength({ min: 8 })
      .withMessage("password is must be 8 characters"),

    // body("emailOtp")
    // .exists()
    // .withMessage("emailOtp is required")
    // .notEmpty()
    // .withMessage("emailOtp cannot be empty")
    // .isString()
    // .withMessage("emailOtp must be a string")
    // .isLength({ min: 4, max: 4 })
    // .withMessage("emailOtp must be exactly 4 characters"),

  ];
};


const signupvalidation = (req, res, next) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {

    return next();
  }

  const extractedErrors = [];
  errors.array().map((error) => extractedErrors.push(error.msg));

  return res.status(422).json({ message: extractedErrors[0] });
};




module.exports = { signupvalidationRule, signupvalidation }