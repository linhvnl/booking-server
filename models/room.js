// ---------------------------
// IMPORT
// import package "mongoose"
const mongoose = require("mongoose");
// trích xuất hàm tạo lược đồ Schema
const { Schema } = require("mongoose");

// ---------------------------
// SCHEMA - room
const roomSchema = new Schema(
  {
    // Tên loại phòng
    title: { type: String, required: true },
    // Mức giá của loại phòng đó (tính theo ngày)
    price: { type: Number, required: true },
    // Số người tối đa
    maxPeople: { type: Number, required: true },
    // Mô tả về loại phòng
    desc: { type: String, required: true },
    // Danh sách số phòng của loại phòng này
    roomNumbers: [Number],
  },
  { timestamps: true }
);

// ---------------------------
// EXPORT
module.exports = mongoose.model("Room", roomSchema);
