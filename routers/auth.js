const express = require("express");
const validate = require("../middleware/joi-validate");
const { signupSchema, loginSchema } = require("../utils/validate-schema/auth");
const { signup, login } = require("../controllers/auth");
const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

module.exports = router;
