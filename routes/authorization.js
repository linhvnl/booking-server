// ---------------------------
// IMPORT PACKAGE
// package để sử dụng express.js
const express = require("express");

// ---------------------------
// CREATE ROUTER
const router = express.Router();

// ---------------------------
// IMPORT CONTROLLERS
const authorizationController = require("../controllers/authorization");

// ---------------------------
// MIDDLEWARE USE CONTROLLER
// AUTH > CLIENT > POST > SIGN UP
router.post("/signup", authorizationController.createUser);

// AUTH > CLIENT > POST > LOGIN > FOR USER
router.post("/login", authorizationController.loginUser);

// AUTH > CLIENT > POST > LOGIN > FOR ADMIN
router.post("/login-admin", authorizationController.loginAdmin);

// ---------------------------
// EXPORT
module.exports = router;
