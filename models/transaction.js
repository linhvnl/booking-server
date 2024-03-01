// ---------------------------
// IMPORT
// import package "mongoose"
const mongoose = require("mongoose");
// trích xuất hàm tạo lược đồ Schema
const { Schema } = require("mongoose");

// ---------------------------
// SCHEMA - transaction
const transactionSchema = new Schema({
  // user: Username của người đặt phòng
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
  },

  // hotel: _Id của khách sạn đã đặt
  hotel: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },

  // room: Danh sách các phòng đã đặt
  room: [
    {
      roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
      roomNumbers: [Number],
    },
  ],

  // dateStart: Ngày nhận phòng - dateEnd: Ngày trả phòng
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },

  // price: Chi phí
  price: { type: Number, required: true },

  // payment: Hình thức thanh toán (Credit Card, Cash)
  payment: { type: String, required: true },

  // status: Tình trạng (Booked, Checkin, Checkout)
  status: { type: String, required: true },
});

// ---------------------------
// SCHEMA - STATIC
// FIND TRANSACTIONS BY VALIDITY AND DATE
// return this.model('Animal').find({ type: this.type }, cb);
transactionSchema.statics.findByValidAndDate = function (
  hotelID, // array
  dateStart,
  dateEnd
) {
  // filter theo Transaction để đủ điều kiện còn phòng trống theo ngày
  // fetch transaction còn hiệu lực và TRÙNG ngày từ hotel này
  return this.find({
    // transactions theo hotel: hotelID,
    hotel: { $in: hotelID },
    // transactions còn hiệu lực
    status: { $in: ["Booked", "Checkin"] },
    // transactions TRÙNG dates với yêu cầu
    dateStart: { $lt: new Date(dateEnd) },
    dateEnd: { $gt: new Date(dateStart) },
    // KO TRÙNG: end transactions <= start req || start transactions >= end req
    // TRÙNG: end transactions > start req && start transactions < end req
  });
};

// ---------------------------
// EXPORT
module.exports = mongoose.model("Transaction", transactionSchema);
