const router = require("express").Router();
const userControllser = require("../../../controllers/user");

router.get("/get-all", userControllser.getAll);

router.put("/update", userControllser.update);

router.post("/delete", userControllser.delete);

module.exports = router;
