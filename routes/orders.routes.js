const {container} = require("../di.setup");
const express = require("express");
const router = express.Router();

router.post("/:bookId", /*******/ container.resolve("OrdersController").create_order);
router.patch("/:orderId/:bookId", container.resolve("OrdersController").update_order);
router.delete("/:orderId", /****/ container.resolve("OrdersController").delete_order);
router.get("/:orderId", /*******/ container.resolve("OrdersController").get_order);
router.get("/", /***************/ container.resolve("OrdersController").get_orders);
router.post("/finalize/:ordreId", container.resolve("OrdersController").finalize_order);

module.exports = router;