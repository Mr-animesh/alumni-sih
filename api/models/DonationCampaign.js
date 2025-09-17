const mongoose = require("mongoose");

const donationCampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ["Student Aid", "University", "Event", "Other"], default: "Other" },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("DonationCampaign", donationCampaignSchema);


