// ---------------------------
// IMPORT node core modules
const fs = require("fs");
const path = require("path");

// ---------------------------
// HELPER FUNCTION
module.exports = function (fileName) {
  // tạo biến helper cho path đến file data
  const DATA_PATH = path.join(
    path.dirname(require.main.filename),
    "data",
    fileName
  );
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
};
