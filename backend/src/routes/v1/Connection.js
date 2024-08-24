const express = require("express");
const {
  updateConnection,
  newConnection,
  getConnectionById,
} = require("../../controllers/ConnectionController");
const router = express.Router({ mergeParams: true });

router.get("/:id", getConnectionById);
router.post("", newConnection);
router.put("/:id", updateConnection);

module.exports = router;
