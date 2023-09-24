const express = require("express");
const router = express.Router();

const { validateBody, authenticate, upload } = require("../middlewares");

const { signupSchema, loginSchema } = require("../schemas/userSchemas");

const {
  signup,
  login,
  logout,
  getCurrent,
  updateAvatar,
} = require("../controllers/userControllers");

router.post("/signup", validateBody(signupSchema), signup);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrent);

router.patch("/avatar", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
