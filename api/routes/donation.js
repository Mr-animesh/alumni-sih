const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const { createCampaign, listCampaigns, getCampaign, donate, confirmDonation, listDonations } = require("../controllers/donationController");
const {adminMiddleware} = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", authMiddleware, listCampaigns);
router.get("/donations", adminMiddleware, listDonations);
router.get("/:id", authMiddleware, getCampaign);
router.post("/", authMiddleware, authorizeRoles("admin", "alumni"),adminMiddleware, createCampaign);
router.post("/:id/donate", authMiddleware, donate);
router.post("/confirm", authMiddleware, confirmDonation);

module.exports = router;


