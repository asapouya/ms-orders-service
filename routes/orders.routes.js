const {container} = require("../di.setup");
const express = require("express");
const router = express.Router();

const ordersController = container.resolve("OrdersController")

router.post("/:bookId", /*******/ ordersController.create_order);
router.patch("/:orderId/:bookId", ordersController.update_order);
router.delete("/:orderId", /****/ ordersController.delete_order);
router.get("/:orderId", /*******/ ordersController.get_order);
router.get("/", /***************/ ordersController.get_orders);
router.post("/finalize/:orderId", ordersController.finalize_order);

module.exports = router;