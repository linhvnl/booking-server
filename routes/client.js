// ---------------------------
// IMPORT PACKAGE
// package để sử dụng express.js
const express = require("express");

// ---------------------------
// CREATE ROUTER
const router = express.Router();

// ---------------------------
// IMPORT CONTROLLERS
const clientController = require("../controllers/client");

// ---------------------------
// MIDDLEWARE USE CONTROLLER
// ______
// CLIENT > GET > HOTELS
router.get("/hotels", clientController.getHotelAggregation);

// ______
// CLIENT > POST > SEARCH HOTEL
router.post("/search", clientController.postSearchHotel);

// ______
// CLIENT > GET > DETAIL HOTEL
router.get("/hotel/:hotelID", clientController.getHotel);

// ______
// CLIENT > POST > TRANSACTION > BOOKING
router.post("/booking", clientController.postBooking);

// CLIENT > POST > TRANSACTION > GET USER INFORMATION
router.post("/user-info", clientController.postGetUser);

// CLIENT > POST > TRANSACTION > GET ROOM AVAILABLE
router.post("/room-available", clientController.postGetRoomAvailable);

// CLIENT > POST > TRANSACTIONS
router.post("/transactions", clientController.postGetTransactions);

// ---------------------------
// EXPORT
module.exports = router;
