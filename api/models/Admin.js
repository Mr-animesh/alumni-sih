const mongoose = require("mongoose");
const { type } = require("os");

const adminSchema = new mongoose.Schema({
    users: {
        type: Number
    },
    events: {
        type: Number,
    },
    fundraises: {
        type: Number,
    }
})

module.exports = mongoose.model("Admin", adminSchema);