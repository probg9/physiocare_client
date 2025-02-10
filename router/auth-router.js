const express = require("express");
const router = express.Router();
const authControllers = require("../controller/auth-controller");
const { signupSchema, loginSchema } = require("../validators/auth-validator");
const validate = require("../middleware/validate-middleware");
const authMiddleware = require("../middleware/auth-middleware");

router.route("/").get(authControllers.home);

router
  .route("/register")
  .post(validate(signupSchema), authControllers.register);

router.route("/login").post(validate(loginSchema), authControllers.login);

router.route("/login").post(authControllers.login);
router.route("/home").post(authControllers.home);
router.route("/user").get(authMiddleware, authControllers.user);

module.exports = router;
