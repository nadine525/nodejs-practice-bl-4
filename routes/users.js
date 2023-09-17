const express = require("express");
const router = express.Router();

const validateBody = require("../middlewares/validateBody");

const { signupSchema, loginSchema } = require("../schemas/userSchemas");

const {
  signup,
  login,
  logout,
  getCurrent,
} = require("../controllers/userControllers");

const authenticate = require("../middlewares/authenticate");

router.post("/signup", validateBody(signupSchema), signup);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrent);

module.exports = router;
