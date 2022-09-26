const co = require("co");
const Message = require("../models/message");

module.exports = {
  add: (req, res) => {
    const { from, to, message } = req.body;
    co(function* () {
      const addMessage = yield Message.create({
        users: [from, to],
        message: {
          text: message.text,
          image: message.image,
          file: message.file,
        },
        sender: from,
      });
      console.log(addMessage);
      return addMessage;
    })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err));
  },

  get: (req, res) => {
    const { from, to } = req.body;
    co(function* () {
      const messages = yield Message.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updateAt: 1 });

      const messData = messages.map((mess) => {
        return {
          fromSelf: mess.sender.toString() === from,
          messages:
            mess.message?.text || mess.message?.file || mess.message?.image,
        };
      });
      return messData;
    })
      .then((data) => res.status(200).json(data))
      .catch((err) => err.status(500).json(err));
  },
};
