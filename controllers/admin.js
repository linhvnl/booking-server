// ---------------------------
// IMPORT MODELS
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const User = require("../models/user");
const Transaction = require("../models/transaction");

// ---------------------------
// IMPORT HELPER FUNCTION
const fetchAllDocsAndPaging = require("../utils/fetchAllDocsAndPaging");

// ---------------------------
// EXPORT CONTROLERS
/////////////////
// ADMIN > GET > DASHBOARD
module.exports.getDashboardAggregation = async (req, res, next) => {
  // ------- Aggregation for Home Dashboard information
  try {
    // Số lượng tất cả User của hệ thống
    const numUsers = await User.estimatedDocumentCount();

    // Số lượng tất cả Transaction của hệ thống
    const numTransactions = await Transaction.estimatedDocumentCount();

    // tổng doanh thu tất cả Transaction của hệ thống
    let totalTransactions = await Transaction.aggregate().group({
      _id: null,
      count: { $sum: "$price" },
    });

    // doanh thu trung bình hàng tháng (tính 3 tháng gần nhất)
    // lấy year/month hiện tại
    const curYear = new Date().getFullYear();
    const curMonth = new Date().getMonth();
    const minDate = new Date(
      `${curYear}-${(curMonth + 1).toString().padStart(2, "0")}-01`
    );
    const maxDate = new Date(
      `${curYear}-${(curMonth + 2).toString().padStart(2, "0")}-01`
    );
    let balanceTransactions = await Transaction.aggregate()
      .match({
        dateEnd: { $gte: minDate, $lt: maxDate },
      })
      .group({
        _id: null,
        count: { $sum: "$price" },
      });

    // lấy 8 Transaction gần nhất
    // await Transaction.aggregate().sort({ dateEnd: -1 }).limit(8)
    let lastestTransactions = await Transaction.find()
      .populate("hotel", "name")
      .sort({ dateEnd: -1 })
      .limit(8);

    // return response
    return res.status(200).json({
      numUsers,
      numTransactions,
      totalTransactions: totalTransactions[0].count,
      balanceTransactions: balanceTransactions[0].count,
      lastestTransactions,
    });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

/////////////////
// ADMIN > GET > USERS
module.exports.getUsers = async (req, res, next) => {
  // request > body/ query/ params
  // số document trên 1 trang
  const perPage = +req.query.perPage;
  // số trang hiện tại
  const page = +req.query.page;

  // fetch all users and paging
  // dùng HELPER FUNCTIONS chung logic
  await fetchAllDocsAndPaging(res, perPage, page, User, "users");
};

/////////////////
// ADMIN > GET > HOTELS
module.exports.getHotels = async (req, res, next) => {
  // request > body/ query/ params
  // số document trên 1 trang
  const perPage = +req.query.perPage;
  // số trang hiện tại
  const page = +req.query.page;

  // fetch all hotels and paging
  // dùng HELPER FUNCTIONS chung logic
  await fetchAllDocsAndPaging(res, perPage, page, Hotel, "hotels");
};

// ADMIN > GET > HOTELS TO USE ID - NAME
module.exports.getHotelsToGetName = async (req, res, next) => {
  try {
    // fetch hotels
    const hotels = await Hotel.find({}, "name");

    // return response error
    if (!hotels) return res.status(400).json({ message: "Error" });

    // return response
    return res.status(200).json(hotels);

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// ADMIN > GET > HOTEL
module.exports.getHotel = async (req, res, next) => {
  // request > body/ query/ params
  const hotelID = req.params.hotelID;

  // fetch hotel by ID
  // (sử dụng methods trên instance, được tạo thêm ở Schema)
  await Hotel.getHotelByID(res, hotelID);
};

// ADMIN > POST > HOTEL > DELETE
module.exports.postHotelDelete = async (req, res, next) => {
  // request > body/ query/ params
  const hotelID = req.body.hotelID;

  // delete hotel
  try {
    // fetch hotels
    const transaction = await Transaction.findOne({ hotel: hotelID });

    // return response ALERT
    if (transaction)
      return res.status(400).json({
        message: "ALERT: This hotel had transactions, so it is not be deleled!",
      });

    // if no transactions found => delele this hotel
    const result = await Hotel.findByIdAndDelete(hotelID);

    // return response error
    if (!result) return res.status(400).json({ message: "Error" });

    // return response
    return res
      .status(200)
      .json({ message: "Handle success: This hotel has been deleted!" });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// ADMIN > POST > HOTEL > ADD
module.exports.postHotelAdd = async (req, res, next) => {
  // request > body/ query/ params
  const photos = req.body.photos.split(",");

  // add hotel
  try {
    // tạo 1 instance hotel mới
    const newHotel = new Hotel({ ...req.body, photos });

    // lưu vào database
    const result = await newHotel.save();

    // return response error
    if (!result) return res.status(400).json({ message: "Error" });

    // return response success
    return res.status(200).json({ message: "New hotel has been added." });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// ADVANCED
// ADMIN > POST > HOTEL > EDIT
module.exports.postHotelEdit = async (req, res, next) => {
  // request > body/ query/ params
  const photos = req.body.photos.split(",");
  const hotelID = req.body.hotelID;

  // edit hotel
  try {
    // update vào database
    const result = await Hotel.findByIdAndUpdate(hotelID, {
      ...req.body,
      photos,
    });

    // return response error
    if (!result) return res.status(400).json({ message: "Error" });

    // return response success
    return res.status(200).json({ message: "This hotel has been edited." });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

/////////////////
// ADMIN > GET > ROOMS
module.exports.getRooms = async (req, res, next) => {
  // request > body/ query/ params
  // số document trên 1 trang
  const perPage = +req.query.perPage;
  // số trang hiện tại
  const page = +req.query.page;

  // fetch all rooms and paging
  // dùng HELPER FUNCTIONS chung logic
  await fetchAllDocsAndPaging(res, perPage, page, Room, "rooms");
};

// ADMIN > GET > ROOM
module.exports.getRoom = async (req, res, next) => {
  // request > body/ query/ params
  const roomID = req.params.roomID;

  // fetch room
  try {
    // fetch by ID
    const room = await Room.findById(roomID);

    // find Hotel của Room này
    const belongHotel = await Hotel.findOne({ rooms: roomID }, "name");

    // return response error
    if (!room || !belongHotel)
      return res.status(400).json({ message: "Error" });

    // return response
    return res.status(200).json({ room, belongHotel });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// ADMIN > POST > ROOM > DELETE
module.exports.postRoomDelete = async (req, res, next) => {
  // request > body/ query/ params
  const roomID = req.body.roomID;

  // delete room
  try {
    // fetch rooms
    const transaction = await Transaction.findOne({
      "room.roomId": roomID,
    }).lean();

    // return response ALERT
    if (transaction)
      return res.status(400).json({
        message: "ALERT: This room had transactions, so it is not be deleled!",
      });

    // if no transactions found => delele this room
    const result = await Room.findByIdAndDelete(roomID);

    // return response error
    if (!result) return res.status(400).json({ message: "Error" });

    // update Hotel => xóa Room khỏi Hotel
    const updateHotel = await Hotel.updateOne(
      { rooms: roomID },
      { $pull: { rooms: roomID } }
    );

    // return response error
    if (!updateHotel) return res.status(400).json({ message: "Error" });

    // return response
    return res
      .status(200)
      .json({ message: "Handle success: This room has been deleted!" });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// ADMIN > POST > ROOM > ADD
module.exports.postRoomAdd = async (req, res, next) => {
  // request > body/ query/ params
  const hotelID = req.body.hotelID;
  const roomNumbers = req.body.roomNumbers
    .split(",")
    .map((item) => Number(item));

  // add room
  try {
    // tạo 1 instance room mới
    const newRoom = new Room({ ...req.body, roomNumbers });

    // lưu vào database
    const result = await newRoom.save();

    // return response error
    if (!result) return res.status(400).json({ message: "Error" });

    // update Hotel => add Room vào Hotel
    const updateHotel = await Hotel.updateOne(
      { _id: hotelID },
      { $push: { rooms: result } }
    );

    // return response error
    if (!updateHotel) return res.status(400).json({ message: "Error" });

    // return response success
    return res.status(200).json({ message: "New room has been added." });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// ADVANCED
// ADMIN > POST > ROOM > EDIT
module.exports.postRoomEdit = async (req, res, next) => {
  // request > body/ query/ params
  const roomID = req.body.roomID;
  const roomNumbers = req.body.roomNumbers.split(",");

  // edit room
  try {
    // update vào database
    const result = await Room.findByIdAndUpdate(roomID, {
      ...req.body,
      roomNumbers,
    });

    // return response error
    if (!result) return res.status(400).json({ message: "Error" });

    // return response success
    return res.status(200).json({ message: "This room has been edited." });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

/////////////////
// ADMIN > GET > TRANSACTIONS
module.exports.getTransactions = async (req, res, next) => {
  // request > body/ query/ params
  // số document trên 1 trang
  const perPage = +req.query.perPage;
  // số trang hiện tại
  const page = +req.query.page;

  // fetch all transactions and paging
  // dùng HELPER FUNCTIONS chung logic
  await fetchAllDocsAndPaging(res, perPage, page, Transaction, "transactions");
};
