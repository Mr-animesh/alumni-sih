const express = require("express");
const router = express.Router();
const { createEvent, getEvents, registerForEvent, getEventById } = require("../controllers/eventController");
const {authMiddleware , authorizeRoles}= require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");


// Create event (Admin/Alumni)
router.post("/", authMiddleware, authorizeRoles("admin", "alumni"), adminMiddleware , createEvent);

// Get all events
router.get("/", authMiddleware, getEvents);
router.get("/:id", authMiddleware, getEventById);

// Register for event
router.post("/:id/register", authMiddleware, registerForEvent);

module.exports = router;
