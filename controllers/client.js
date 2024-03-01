// ---------------------------
// IMPORT HELPER FUNCTION
const titleCase = require("../utils/titleCase");

// ---------------------------
// IMPORT MODELS
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const User = require("../models/user");
const Transaction = require("../models/transaction");

// ---------------------------
// EXPORT CONTROLERS
// CLIENT > GET > HOTELS (mẫu - không sử dụng)
module.exports.getHotels = async (req, res, next) => {
  try {
    // fetch all, select field of document
    const hotels = await Hotel.find(
      null,
      "name city type rating photos cheapestPrice"
    );

    // return response error
    if (!hotels) return res.status(400).json({ message: "Error" });

    // return response
    return res.status(200).json(hotels);

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// CLIENT > GET > HOTELS
module.exports.getHotelAggregation = async (req, res, next) => {
  // ------- Aggregation for Home information
  try {
    // Số lượng các khách sạn theo khu vực: Hà Nội, HCM và Đà Nẵng.
    let hotelByCity = await Hotel.aggregate().group({
      _id: "$city",
      count: { $sum: 1 },
    });

    // Số lượng khách sạn theo từng loại.
    let hotelByType = await Hotel.aggregate().group({
      _id: "$type",
      count: { $sum: 1 },
    });

    // Top 3 khách sạn có rating cao nhất
    let hotelTop3Rating = await Hotel.aggregate().sort({ rating: -1 }).limit(3);

    // return response
    return res.status(200).json({ hotelByCity, hotelByType, hotelTop3Rating });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// CLIENT > POST > SEARCH HOTEL
module.exports.postSearchHotel = async (req, res, next) => {
  // request > body/ query/ params
  const { destination, dateStart, dateEnd, roomQuantity } = req.body;
  const destinationEdit = titleCase(destination);

  // search hotels
  try {
    // query cho search results
    //-----------------------
    // filter by "destinationEdit"
    const hotels = await Hotel.find({ city: destinationEdit }).populate(
      "rooms"
    );

    //-----------------------
    // filter by dates and roomQuantity
    // fetch transaction còn hiệu lực và TRÙNG ngày
    const transactions = await Transaction.findByValidAndDate(
      hotels.map((h) => h._id),
      dateStart,
      dateEnd
    );

    // tạo biến result lưu kết quả filter
    const results = hotels.filter((h) => {
      // filter từng hotel theo room number các transactions đã booked hoặc đang check-in để lọc room available còn lại
      // sử dụng method thừa kế trên instance model hotel
      const { countRoomsAvailable } = h.filterRoomsAvailable(
        h,
        transactions.filter((t) => t.hotel.toString() === h._id.toString())
      );

      // return filter
      return countRoomsAvailable >= roomQuantity;
    });

    //-----------------------
    // response
    // if no results => send message
    if (results.length === 0)
      return res.status(400).json({ message: "No matching hotels!" });

    // send results
    return res.status(200).json(results);

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// CLIENT > GET > DETAIL HOTEL
module.exports.getHotel = async (req, res, next) => {
  // request > body/ query/ params
  const hotelID = req.params.hotelID;

  // fetch hotel by ID
  // (sử dụng methods trên instance, được tạo thêm ở Schema)
  await Hotel.getHotelByID(res, hotelID);
};

// CLIENT > POST > TRANSACTION > GET USER INFORMATION
module.exports.postGetUser = async (req, res, next) => {
  // request > body/ query/ params
  const username = req.body.username;

  // get user
  try {
    // fetch user information
    const user = await User.findOne(
      { username: username },
      "-password -isAdmin"
    );

    // return response error
    if (!user) return res.status(400).json({ message: "Error" });

    // return response
    return res.status(200).json(user);

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// CLIENT > POST > TRANSACTION > GET ROOM AVAILABLE
module.exports.postGetRoomAvailable = async (req, res, next) => {
  // request > body/ query/ params
  const hotelID = req.body.hotelID;
  const dateStart = req.body.dateStart;
  const dateEnd = req.body.dateEnd;

  // check room available
  try {
    // fetch hotel và room theo hotelID
    const hotel = await Hotel.findById(hotelID, "name rooms").populate("rooms");

    // fetch transaction còn hiệu lực và TRÙNG ngày từ hotel này
    // (sử dụng methods trên instance, được tạo thêm ở Schema)
    const transactions = await Transaction.findByValidAndDate(
      [hotelID],
      dateStart,
      dateEnd
    );

    // tạo biến result (copy hotel) để lưu kết quả filter
    const result = hotel._doc;

    // ----- case 1: nếu không có transactions từ find ở trên
    if (transactions.length === 0)
      return res.status(200).json({ ...result, roomsAvailable: result.rooms });

    // nếu có, tiếp tục filter theo room number các transactions đã booked hoặc đang check-in để lọc room available còn lại
    // (sử dụng methods trên instance, được tạo thêm ở Schema)
    const { filterRoomsAvailable } = hotel.filterRoomsAvailable(
      result,
      transactions
    );

    // ----- case 2: nếu còn room numbers available
    if (filterRoomsAvailable.length > 0)
      return res.status(200).json({
        ...result,
        roomsAvailable: filterRoomsAvailable,
      });

    // ----- case 3: nếu không có room numbers available
    return res
      .status(400)
      .json({ message: "No rooms available in your check-in-date!" });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// CLIENT > POST > TRANSACTION > BOOKING
module.exports.postBooking = async (req, res, next) => {
  // request > body/ query/ params
  const { user, dateStart, dateEnd, hotel, room, price, payment } = req.body;

  try {
    // 1> update user information
    const result1 = await User.updateOne(
      { username: user.username },
      { ...user }
    );

    // 2> tạo 1 instance transaction mới
    const newTransaction = new Transaction({
      ...req.body,
      user: { userId: user._id, username: user.username },
      status: "Booked",
    });
    // lưu vào database
    const result2 = await newTransaction.save();

    // return response error
    if (!result2) return res.status(400).json({ message: "Error" });

    // return response success
    return res.status(200).json({ message: "Your booking has been reserved." });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

//  CLIENT > POST > TRANSACTIONS
module.exports.postGetTransactions = async (req, res, next) => {
  // request > body/ query/ params
  const username = req.body.username;

  // get transactions
  try {
    // fetch all transactions by username
    const transactions = await Transaction.find({
      "user.username": username,
    })
      .populate("hotel", "name")
      .sort({ dateEnd: -1 });

    // response error
    if (!transactions) return res.status(400).json({ message: "Error" });

    // response success
    return res.status(200).json(transactions);

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};
