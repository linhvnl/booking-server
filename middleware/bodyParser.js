// ---------------------------
// IMPORT PACKAGE
// package để phân tích cú pháp request.body
const bodyParser = require("body-parser");

// ---------------------------
// EXPORT MIDDLEWARE FUNCTION
// USE BODY-PARSER
// json
module.exports.useBodyParserJSON = bodyParser.json();

// url-encoded
module.exports.useBodyParserURLEncoded = bodyParser.urlencoded({
  extended: false,
});
