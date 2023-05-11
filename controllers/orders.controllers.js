const Orders = require("../models/orders.model");
const { finalize_order } = require("../services/orders.service");

module.exports = {
    async create_order(req, res) {
        try {
            const userHeader = JSON.parse(req.header("x-user"));            
            const userId = userHeader._id;
            const bookId = req.params.bookId;

            console.log(userHeader);
            console.log(userId);

            const order = new Orders({
                userId: userId,
                bookId: bookId
            });
            await order.save();
            res.status(201).send(order);
        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    async update_order(req, res) {
        try {
            const orderId = req.params.orderId;
            const bookId = req.params.bookId;
            const userHeader = JSON.parse(req.header("x-user"));            
            const userId = userHeader._id;
            
            const order = await Orders.findById(orderId);
            if(!order) return res.status(404).send("Order not found.");
            if(order.userId != userId) return res.status(401).send("Unauthorized.");

            if(req.query.remove) {

                console.group("remove")
                const index = order.bookId.indexOf(bookId);
                if (index > -1) {
                    order.bookId.splice(index, 1);
                    if(order.bookId.length == 0) {
                        await Orders.findByIdAndRemove(order._id);
                        return res.status(204).end();
                    }
                    const Updated = await order.save();
                    res.send(Updated);
                }
            } else {
                console.log("add")
                order.bookId.push(bookId);
                const updatedOrder = await order.save();
                return res.send(updatedOrder);
            }
        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    async delete_order(req, res) {
        try {
            const userHeader = JSON.parse(req.header("x-user"));            
            const orderId = req.params.orderId;
            const userId = userHeader._id;
            const order = await Orders.findOneAndDelete({userId: userId, _id: orderId});
            if(!order) return res.status(404).send("Order Not Found.");
            if(order.status == "pending") return order.status = "canceled";
            res.send(order);
        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    async get_order(req, res) {

        try {
            const userHeader = JSON.parse(req.header("x-user"));            
            const userId = userHeader._id;
            const orderId = req.params.orderId;
            const order = await Orders.findById(orderId);
            if(order.userId != userId) return res.status(401).send("Unauthorized.")
            res.send(order);   
        } catch (err) {
            res.status(400).send(err.message);
        }

    },
    async get_orders(req, res) {
        try {
            const userHeader = req.header("x-user");
            const userId = userHeader._id;
            const orders = await Orders.find({userId: userId});
            res.send(orders);
        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    finalize_order(req, res) {
        finalize_order(req, res);
    }
}