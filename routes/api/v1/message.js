const router = require("express").Router();
const messageController = require("../../../controllers/message");

router.post("/add", messageController.add);

router.post("/get", messageController.get);

module.exports = router;
