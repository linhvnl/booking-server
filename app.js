// ---------------------------
// IMPORT PACKAGE
// package express.js work with server
const express = require("express");

// package mongoose work with mongodb
const mongoose = require("mongoose");

// ---------------------------
// IMPORT MIDDLEWARE
const corsMiddleware = require("./middleware/cors");
const bodyParserMiddleware = require("./middleware/bodyParser");

// ---------------------------
// IMPORT ROUTERS
const authorizationRouter = require("./routes/authorization");
const clientRouter = require("./routes/client");
const adminRouter = require("./routes/admin");
const errorRouter = require("./routes/error");

// ---------------------------
// CREATE APP SERVER
const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------
// MIDDLEWARE USE PACKAGES
// middleware to use "cors"
app.use(corsMiddleware.useCors);

// middleware to use "body-parser"
app.use(bodyParserMiddleware.useBodyParserJSON);
app.use(bodyParserMiddleware.useBodyParserURLEncoded);

// ---------------------------
// MIDDLEWARE USE ROUTERS
// _______________________
// AUTHORIZATION ROUTER
app.use(authorizationRouter);

// _______________________
// CLIENT ROUTER
app.use("/client", clientRouter);
app.use("/admin", adminRouter);

// _______________________
// ERROR ROUTER - Handling non matching request from the client
app.use(errorRouter);

// ---------------------------
// CONNECT TO DATABASE and SERVER LISTEN
mongoose
  .connect(
    "mongodb+srv://linhvnfx21261:0HVtTUgu3SudYeU3@shop.9ycowdn.mongodb.net/hotel_booking?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("CONNECTED!");
    // server listen
    app.listen(PORT);
    console.log(`server started on port ${PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });

//
//
/*
// --------------------------
////////////////////////
// import json to database
// const readFile = require("./utils/readFile");
// const Hotel = require("./models/hotel");
// const Room = require("./models/room");
//
// .then((result) => {
//   const data = readFile("rooms.json");
//   data.forEach((item) => {
//     item._id = new mongoose.Types.ObjectId(item._id.$oid);
//     item.createdAt = new Date(item.createdAt.$date);
//     item.updatedAt = new Date(item.updatedAt.$date);
//   });
//   Room.create(data);
// })
// .then((result) => {
//   const data = readFile("hotels.json");
//   data.forEach((item) => {
//     item._id = new mongoose.Types.ObjectId(item._id.$oid);
//     item.rooms.forEach((r, i) => {
//       item.rooms[i] = new mongoose.Types.ObjectId(r);
//     });
//   });
//   // Hotel.insertMany(data);
//   Hotel.create(data);
// })
*/
