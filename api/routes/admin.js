const express = require("express");
const router = express.Router();
const {authMiddleware , authorizeRoles}= require("../middleware/authMiddleware");
const { allLogs } = require("../controllers/adminController");

// Get all activity log(admin)
router.get("/", authMiddleware, authorizeRoles("admin"), allLogs);



module.exports = router;

