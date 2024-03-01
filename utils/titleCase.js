// ---------------------------
// HELPER FUNCTION
module.exports = function (string) {
  const result = string
    .toLowerCase()
    .split(" ")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
  return result;
};
