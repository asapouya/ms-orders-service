const express = require("express");
const router = express.Router();

const { 
    create_order, 
    update_order,
    delete_order,
    get_order,
    get_orders
} = require("../controllers/orders.controllers");

router.post("/:bookId", create_order);
router.patch("/:orderId/:bookId", update_order);
router.delete("/:orderId", delete_order);
router.get("/:orderId", get_order);
router.get("/", get_orders);
router.post("/finalize/:ordreId");

module.exports = router;