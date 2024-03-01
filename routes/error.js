// ---------------------------
// IMPORT PACKAGE
// package để sử dụng express.js
const express = require("express");

// ---------------------------
// CREATE ROUTER
const router = express.Router();

// ---------------------------
// IMPORT CONTROLLERS
const errorController = require("../controllers/error");

// ---------------------------
// MIDDLEWARE USE CONTROLLER
// ROUTE NOT FOUND
router.use(errorController.get404);

// ---------------------------
// EXPORT
module.exports = router;
