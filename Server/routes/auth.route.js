const express = require("express");
const { registerController, loginController, logoutController } = require("../controllers/auth.controller");
const { registerValidator, loginValidator } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Registers a new user by accepting username, email, and password.
 * @body {username, email, password}
 * @access Public
 */
authRouter.post("/register", registerValidator, validate, registerController);

/**
 * @route POST /api/auth/login
 * @description 
 * @body {email, password}
 * @access Public
 */
authRouter.post("/login", loginValidator, validate, loginController);

/**
 * @route GET /api/auth/logout
 * @description 
 * @access Private
 */
authRouter.get("/logout", isAuthenticated, logoutController);

module.exports = authRouter;