// ---------------------------
// IMPORT PACKAGE
// package để sử dụng express.js
const express = require("express");

// ---------------------------
// CREATE ROUTER
const router = express.Router();

// ---------------------------
// IMPORT CONTROLLERS
const adminController = require("../controllers/admin");

// ---------------------------
// MIDDLEWARE USE CONTROLLER
// ______
// ADMIN > GET > DASHBOARD
router.get("/dashboard", adminController.getDashboardAggregation);

// ______
// ADMIN > GET > USERS
router.get("/users", adminController.getUsers);

// ______
// ADMIN > GET > HOTELS
router.get("/hotels", adminController.getHotels);

// ADMIN > GET > HOTELS TO USE ID - NAME
router.get("/hotels-name", adminController.getHotelsToGetName);

// ADMIN > GET > HOTEL
router.get("/hotel/:hotelID", adminController.getHotel);

// ADMIN > POST > HOTEL > DELETE
router.post("/hotel-delete", adminController.postHotelDelete);

// ADMIN > POST > HOTEL > ADD
router.post("/hotel-add", adminController.postHotelAdd);

// ADMIN > POST > HOTEL > EDIT
router.post("/hotel-edit", adminController.postHotelEdit);

// ______
// ADMIN > GET > ROOMS
router.get("/rooms", adminController.getRooms);

// ADMIN > GET > ROOM
router.get("/room/:roomID", adminController.getRoom);

// ADMIN > POST > ROOM > DELETE
router.post("/room-delete", adminController.postRoomDelete);

// ADMIN > POST > ROOM > ADD
router.post("/room-add", adminController.postRoomAdd);

// ADMIN > POST > ROOM > EDIT
router.post("/room-edit", adminController.postRoomEdit);

// ______
// ADMIN > GET > TRANSACTIONS
router.get("/transactions", adminController.getTransactions);

// ---------------------------
// EXPORT
module.exports = router;
