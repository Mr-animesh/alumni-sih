const DonationCampaign = require("../models/DonationCampaign");
const Donation = require("../models/Donation");
const Razorpay = require("razorpay");
const crypto = require("crypto");

exports.createCampaign = async (req, res) => {
  try {
    const campaign = new DonationCampaign({ ...req.body, createdBy: req.user.id });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listCampaigns = async (req, res) => {
  try {
    const campaigns = await DonationCampaign.find().sort({ createdAt: -1 }).populate("createdBy", "name role");
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listDonations = async(req, res) => {
  try {
    const donations = await (Donation.find().populate("amount"));
    res.json(donations)
  } catch (err) {
    
  }
}

exports.getCampaign = async (req, res) => {
  try {
    const campaign = await DonationCampaign.findById(req.params.id).populate("createdBy", "name role");
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });
    const donations = await Donation.find({ campaign: campaign._id }).populate("donor", "name role");
    res.json({ campaign, donations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.donate = async (req, res) => {
  try {
    const { amount, message } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ msg: "Invalid amount" });
    const campaign = await DonationCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      // Fallback dummy order
      const order = {
        id: `order_dummy_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: "INR",
        status: "created",
      };
      return res.json({ order, campaignId: campaign._id, note: message || "", fallback: true });
    }

    // Create Razorpay order (amount in paise)
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({ amount: Math.round(amount * 100), currency: "INR", receipt: `camp_${campaign._id}_${Date.now()}` });

    res.json({ order, campaignId: campaign._id, note: message || "", fallback: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.confirmDonation = async (req, res) => {
  try {
    const { campaignId, amount, message } = req.body;
    
    const campaign = await DonationCampaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    const donation = new Donation({ campaign: campaign._id, donor: req.user.id, amount, message, paymentId: razorpay_payment_id });
    await donation.save();
    campaign.currentAmount += Number(amount || 0);
    await campaign.save();
    res.json({ success: true, donation, campaign });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


