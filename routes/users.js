const express = require("express");
const router = express.Router();

const validateBody = require("../middlewares/validateBody");

const { signupSchema } = require("../schemas/userSchemas");

const { signup } = require("../controllers/userControllers");


router.post("/signup", validateBody(signupSchema), signup)
router.post("/login")
router.post("/logout")
router.get("/current")

module.exports = router;

