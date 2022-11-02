const co = require("co");
const User = require("../models/user");
const CryptoJS = require("crypto-js");

module.exports = {
  getAll: (req, res) => {
    co(function* () {
      const users = yield User.find();
      return users;
    })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err));
  },

  update: (req, res) => {
    const { username, password } = req.body;
    co(function* () {
      const user = yield User.findOne({ username });
      if (req.body.password !== user.password) {
        req.body.password = CryptoJS.AES.encrypt(
          password,
          process.env.PASSWORD_SECRET_KEY
        ).toString();
      }
      const userUpdate = yield User.findOneAndUpdate(
        { username },
        {
          avatar: req.body.avatar || user.avatar,
          fullname: req.body.fullname || user.fullname,
          password: req.body.password || user.password,
        }
      );
      return userUpdate;
    })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err));
  },

  delete: (req, res) => {
    co(function* () {
      const user = yield User.findByIdAndDelete(req.body._id);
      return user;
    })
      .then(() => res.status(200).json({ message: "deleted user" }))
      .catch((err) => res.status(500).json(err));
  },
};
