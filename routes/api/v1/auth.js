const router = require("express").Router();
const { body } = require("express-validator");
const validator = require("../../../handler/validation");
const User = require("../../../models/user");
const authController = require("../../../controllers/auth");
const token = require("../../../handler/token");

// signin
router.post(
  "/signin",
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (!user) {
        return Promise.reject("incorrect username or password");
      }
      return true;
    });
  }),
  validator,
  authController.signin
);

// signup
router.post(
  "/signup",
  body("username")
    .trim()
    .isLength({ min: 8 })
    .withMessage("username must be at 8 characters"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("password must be at 8 characters"),
  body("confirmPassword")
    .trim()
    .isLength({ min: 8 })
    .withMessage("confirmPassword must be at 8 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("username already in use");
      }
    });
  }),
  validator,
  authController.signup
);

// gg login
router.post("/google-login", authController.googleLogin);

// auth
router.post("/verify-token", token.verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
