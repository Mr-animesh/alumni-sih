const express = require("express");
const { getMessages } = require("../controllers/chatController");
const router = express.Router();

router.get("/:userId/:otherId", getMessages);

module.exports = router;
