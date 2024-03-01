// ---------------------------
// IMPORT
// import package "mongoose"
const mongoose = require("mongoose");
// trích xuất hàm tạo lược đồ Schema
const { Schema } = require("mongoose");

// ---------------------------
// SCHEMA - hotel
const hotelSchema = new Schema({
  name: { type: String, required: true },
  // Loại khách sạn (Hotel, Apartments, Resorts, Villas, Cabins)
  type: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  distance: { type: Number, required: true },
  // Danh sách các link ảnh của khách sạn đó
  photos: [{ type: String, required: true }],
  desc: { type: String, required: true },
  rating: Number,
  // Khách sạn có hỗ trợ các tiện ích khác không
  featured: { type: Boolean, required: true },
  // Danh sách các phòng thuộc khách sạn này (ref)
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  // thêm
  cheapestPrice: { type: Number, required: true },
  title: { type: String, required: true },
});

// ---------------------------
// SCHEMA - METHOD
// GET HOTEL BY ID
hotelSchema.statics.getHotelByID = async function (res, id) {
  try {
    // fetch by ID
    const hotel = await this.findById(id);

    // return response error
    if (!hotel) return res.status(400).json({ message: "Error" });

    // return response
    return res.status(200).json(hotel);

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// FILTER AND COUNT ROOM AVAILABLE
hotelSchema.methods.filterRoomsAvailable = function (result, transactions) {
  // filter theo room number các transactions đã booked hoặc đang check-in để lọc room available còn lại
  // tạo mảng chứa kết quả filter
  const filterAvailableAllRoomID = [];
  // tạo biến count tổng số rooms available
  let countAvailableAllRoomID = 0;

  // filter
  result.rooms.forEach((r) => {
    // filter từ mảng roomNumbers
    // check và bỏ các room number đã được booked trong transactions
    const filterAvailableEachRoomID = r.roomNumbers.filter((n) => {
      // biến cờ hiệu (room is available)
      let isAvailable = true;

      // kiểm tra từng transaction
      for (const t of transactions) {
        if (isAvailable === false) break;

        // tìm index của room number có trong transaction
        const index = t.room.findIndex((item) => {
          return item.roomNumbers.includes(n);
        });

        // nếu có index thì return false để bỏ khỏi mảng filter
        if (index !== -1) {
          isAvailable = false;
        }
      }

      return isAvailable;
    });

    // nếu có phòng trống thì push vào mảng room numbers available
    if (filterAvailableEachRoomID.length > 0) {
      // push vào mảng kết quả
      filterAvailableAllRoomID.push({
        _id: r._id,
        desc: r.desc,
        maxPeople: r.maxPeople,
        price: r.price,
        title: r.title,
        roomNumbers: filterAvailableEachRoomID,
      });

      // count tổng số rooms available
      countAvailableAllRoomID += filterAvailableEachRoomID.length;
    }
  });

  // trả kết quả
  return {
    filterRoomsAvailable: filterAvailableAllRoomID,
    countRoomsAvailable: countAvailableAllRoomID,
  };
};

// ---------------------------
// EXPORT
module.exports = mongoose.model("Hotel", hotelSchema);
