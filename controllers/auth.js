const User = require("../models/user");
const CryptoJS = require("crypto-js");
const co = require("co");
const jwt = require("jsonwebtoken");

module.exports = {
  signin: (req, res) => {
    const { username, password } = req.body;
    co(function* () {
      const user = yield User.findOne({ username });
      const decryptPass = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      if (password !== decryptPass) {
        return Promise.reject({
          errors: [
            {
              param: "password",
              msg: "incorrect username or password",
            },
          ],
        });
      }
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "24h",
      });
      const data = yield { user, token };
      return data;
    })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err));
  },

  signup: (req, res) => {
    const { password } = req.body;
    co(function* () {
      req.body.password = CryptoJS.AES.encrypt(
        password,
        process.env.PASSWORD_SECRET_KEY
      );
      const user = yield User.create(req.body);
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "24h",
      });
      const data = yield { user, token };
      return data;
    })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err));
  },

  googleLogin: (req, res) => {
    console.log(req.body);
    const { username } = req.body;
    co(function* () {
      const isExists = yield User.findOne({ username });
      if (!isExists) {
        const user = yield User.create(req.body);
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
          expiresIn: "24h",
        });
        return token;
      }
      const token = jwt.sign(
        { id: isExists._id },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "24h" }
      );
      return token;
    })
      .then((data) => res.status(201).json(data))
      .catch((err) => res.status(500).json(err));
  },
};
