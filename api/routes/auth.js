const express = require("express");
const {adminMiddleware} = require("../middleware/adminMiddleware");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register",adminMiddleware, registerUser);
router.post("/login", loginUser);

module.exports = router;
