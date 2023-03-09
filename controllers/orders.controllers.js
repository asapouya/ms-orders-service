const Orders = require("../models/orders.model");

module.exports = {
    async create_order(req, res) {
        const userId = req.users._id;
        const bookId = req.params.bookId;
        const order = new Orders({
            userId: userId,
            bookId: bookId
        });
        await order.save();
        res.status(201).send(order);
    },
    async update_order(req, res) {
        //get order id from params
        //get book id from params
        //get query string to whether delete the book from order if exists or add book to order
        //
    },
    async delete_order(req, res) {
        const orderId = req.params.orderId;
        const userId = req.user._id;
        const order = await Orders.findById(orderId);
        if(!order.userId == userId) return res.status(401).send("Unauthorized.");
        const deletedOrder = await order.deleteOne();
        res.send(deletedOrder);
    },
    async get_order(req, res) {
        const orderId = req.params.orderId;
        const order = await Orders.findById(orderId);
        res.send(order);
    },
    async get_orders(req, res) {
        const userId = req.user._id;
        const orders = await Orders.find({userId: userId});
        res.send(orders);
    }
}