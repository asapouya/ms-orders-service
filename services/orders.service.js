const BrokerRepo = require("../repositories/broker.repo");

module.exports = {
    async finalize_order(req, res) {
        let broker = null;
        try {
            const userHeader = req.header("x-user")
            const userId = userHeader._id;
            const orderId = req.params.orderId;
            const finalized_order = await Orders.updateOne({_id: orderId, userId: userId},[
                {$set: {status: "fulfilled", dateOfPurchase: new Date()}} 
            ]);
            if(!finalized_order) return res.status(404).send("Order not found.");

            const exchangeType = "fanout";
            const exchangeName = "finalize.order.fanout";
            const booksQueueName = "books.finalize.order.queue";
            const usersQueueName = "users.finalize.order.queue";

            broker = new BrokerRepo(config.get("broker_url"));
            await broker.connect();
            await broker.createChannel();
            broker.errorEvent(err => console.log(err));
            await broker.createExchange(exchangeType ,exchangeName, { durable: true });
            await broker.createQueue(booksQueueName, { durable: true });
            await broker.createQueue(usersQueueName, { durable: true });
            await broker.bindQueueToExchange(booksQueueName, exchangeName, "");
            await broker.bindQueueToExchange(usersQueueName, exchangeName, "");
            broker.publishMessage(exchangeName, JSON.stringify({

                eventName: "finalize.order",
                data: {
                    userId: user._id,
                    reason: "user-deleted",
                    timestamp: Date.now()
                }
            }), "");
            broker.publishMessage(exchangeName, JSON.stringify({

                eventName: "finalize.order",
                data: {
                    userId: user._id,
                    reason: "user-deleted",
                    timestamp: Date.now()
                }
            }), "");
            res.send(finalized_order);
        } catch (err) {
            res.status(400).send(err.message);
        }finally {
            if(broker) {
                broker.close().catch(err => console.log(err));
            }
        }
    }
}