// ---------------------------
// IMPORT
// import package "mongoose"
const mongoose = require("mongoose");
// trích xuất hàm tạo lược đồ Schema
const { Schema } = require("mongoose");

// ---------------------------
// SCHEMA - user
const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: String,
  phoneNumber: String,
  email: String,
  cardNumber: String,
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

// ---------------------------
// EXPORT
module.exports = mongoose.model("User", userSchema);
