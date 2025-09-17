const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getGuidance } = require("../controllers/guidanceController");

const router = express.Router();

router.post("/", authMiddleware, getGuidance);

module.exports = router;


