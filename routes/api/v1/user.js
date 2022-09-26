const router = require("express").Router();
const userControllser = require("../../../controllers/user");

router.get("/get-all", userControllser.getAll);

router.put("/update", userControllser.update);

module.exports = router;
