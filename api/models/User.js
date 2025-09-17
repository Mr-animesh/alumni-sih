const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "alumni", "admin"], default: "alumni" },
  phone: String,
  address: String,
  description: String,
  education: [String],
  experience: [String],
  skills: [String],
  currentJob: String,
  resumeURL: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("User", UserSchema);
