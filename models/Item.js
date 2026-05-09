const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    item_name: String,
    owner_name: String,
    phone: String,
    email: String,
    telegram: String
});

module.exports = mongoose.model("Item", itemSchema);