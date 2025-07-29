const { body } = require("express-validator");

exports.validateSignup = [
  body("name", "Name is required")
    .not()
    .isEmpty(),
  body("email", "Please include a valid email").isEmail(),
  body("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
];

exports.validateLogin = [
  body("email", "Please include a valid email").isEmail(),
  body("password", "Password is required").exists(),
];

exports.validateClient = [
  body("name", "Client name is required")
    .not()
    .isEmpty()
    .trim()
    .escape(),
  body("email", "Please include a valid client email")
    .isEmail()
    .normalizeEmail(),
  body("phone", "Client phone number is required")
    .not()
    .isEmpty()
    .trim()
    .escape(),
  body("address", "Client address is required")
    .not()
    .isEmpty()
    .trim()
    .escape(),
];

exports.validateProject = [
  body("name", "Project name is required")
    .not()
    .isEmpty()
    .trim()
    .escape(),
  body("description", "Project description is required")
    .not()
    .isEmpty()
    .trim()
    .escape(),
  body("clientId", "A valid client ID is required").isMongoId(),
  body("status", "Status is invalid")
    .optional()
    .isIn(["Not Started", "In Progress", "Completed"]),
];
