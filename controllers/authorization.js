// ---------------------------
// IMPORT MODELS
const User = require("../models/user");

// ---------------------------
// EXPORT CONTROLERS
// AUTH > CLIENT > POST > SIGN UP
module.exports.createUser = async (req, res, next) => {
  // request > body
  const username = req.body.username;
  const password = req.body.password;

  try {
    // -------------
    // check user exists
    const user = await User.findOne({ username: username }).exec();
    // return response error
    if (user) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    // -------------
    // nếu username chưa tồn tại thì create new user
    const newUser = new User({ username, password, isAdmin: false });
    // save to database
    const resultUser = await newUser.save();

    // return response error
    if (resultUser) {
      return res
        .status(200)
        .json({ message: "New user has been created successfully!" });
    }

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// AUTH > CLIENT > POST > LOGIN > FOR USER
module.exports.loginUser = async (req, res, next) => {
  // request > body
  const username = req.body.username;
  const password = req.body.password;

  try {
    // -------- check user exists
    const user = await User.findOne({ username: username }).exec();
    // return response error
    if (!user) {
      return res
        .status(400)
        .json({ message: "Username has not signed up yet!" });
    }

    // ------- check password
    if (user.password !== password)
      // return response error
      return res.status(400).json({ message: "Password is incorrect!" });

    // ------- response login success
    return res.status(200).json({ username });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// AUTH > CLIENT > POST > LOGIN > FOR ADMIN
module.exports.loginAdmin = async (req, res, next) => {
  // request > body
  const username = req.body.username;
  const password = req.body.password;

  try {
    // -------- check user exists
    const user = await User.findOne({ username: username }).exec();
    // return response error
    if (!user) {
      return res
        .status(400)
        .json({ message: "Username has not signed up yet!" });
    }

    // ------- check password
    if (user.password !== password)
      // return response error
      return res.status(400).json({ message: "Password is incorrect!" });

    // ------- check Administrator
    if (user.isAdmin !== true)
      // return response error
      return res.status(400).json({ message: "You do not have access!" });

    // ------- response login success
    return res.status(200).json({ username });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};
