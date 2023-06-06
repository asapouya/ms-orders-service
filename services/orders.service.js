class OrdersService {

    constructor({BrokerRepo, MongoRepo}) {
        this.broker = BrokerRepo;
        this.mongo = MongoRepo;
    }

    finalize_order = async (req, res) => {
        try {
            const userHeader = JSON.parse(req.header("x-user"))

            const userId = userHeader._id;
            const orderId = req.params.orderId;
            const finalized_order = await this.mongo.findOneAndUpdate({_id: orderId, userId: userId, status: "pending"},[
                {$set: {status: "fulfilled", dateOfPurchase: new Date()}} 
            ]);
            if(!finalized_order) return res.status(404).send("Order not found.");

            const exchangeType = "fanout";
            const exchangeName = "finalize.order.fanout";
            const booksQueueName = "books.finalize.order.queue";
            const usersQueueName = "users.finalize.order.queue";

            await this.broker.createChannel();
            this.broker.errorEvent(err => console.log(err));
            await this.broker.createExchange(exchangeType ,exchangeName, { durable: true });
            await this.broker.createQueue(booksQueueName, { durable: true });
            await this.broker.createQueue(usersQueueName, { durable: true });
            await this.broker.bindQueueToExchange(booksQueueName, exchangeName, "");
            await this.broker.bindQueueToExchange(usersQueueName, exchangeName, "");
            this.broker.publishMessage(exchangeName, JSON.stringify({

                eventName: "finalize.order",
                data: {
                    userId: finalized_order.userId,
                    books: finalized_order.bookId,
                    reason: "order-finalized",
                    timestamp: Date.now()
                }
            }), "");
            res.send(finalized_order);
        } catch (err) {
            console.log(err);
            res.status(400).send(err.message);
        }
    }

    handle_user_deletion = async () => {
        //listen for messages on rabbitmq
        try {
            await this.broker.createChannel();
            this.broker.errorEvent(err => {
                console.log(err);
            })
            await this.broker.listenForMessage("orders.user.delete.queue", async (msg) => {
                const content = JSON.parse(msg.content.toString());
                const userIdToBeDeleted = content.data.userId;
                try {
                    const order = await this.mongo.deleteMany({userId: userIdToBeDeleted}); 
                    console.log(order);                   
                    this.broker.ack(msg);
                } catch (err) {
                    console.log(err);
                    this.broker.noAck(msg);
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    create_order = async (req, res) => {
        try {
            const userHeader = JSON.parse(req.header("x-user"));            
            const userId = userHeader._id;
            const bookId = req.params.bookId;
            const order = this.mongo.orderFactory({
                userId: userId,
                bookId: bookId
            });
            await order.save();
            res.status(201).send(order);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    update_order = async (req, res) => {
        try {
            const orderId = req.params.orderId;
            const bookId = req.params.bookId;
            const userHeader = JSON.parse(req.header("x-user"));            
            const userId = userHeader._id;
            
            const order = await this.mongo.findById(orderId);
            if(!order) return res.status(404).send("Order not found.");
            if(order.userId != userId) return res.status(401).send("Unauthorized.");

            if(req.query.remove) {

                console.group("remove")
                const index = order.bookId.indexOf(bookId);
                if (index > -1) {
                    order.bookId.splice(index, 1);
                    if(order.bookId.length == 0) {
                        await this.Orders.findByIdAndRemove(order._id);
                        return res.status(204).end();
                    }
                    const Updated = await order.save();
                    res.send(Updated);
                }
            } else {
                order.bookId.push(bookId);
                const updatedOrder = await order.save();
                return res.send(updatedOrder);
            }
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    delete_order = async (req, res) => {
        try {
            const userHeader = JSON.parse(req.header("x-user"));            
            const orderId = req.params.orderId;
            const userId = userHeader._id;
            const order = await this.mongo.findOneAndDelete({userId: userId, _id: orderId});
            if(!order) return res.status(404).send("Order Not Found.");
            if(order.status == "pending") return order.status = "canceled";
            res.send(order);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    get_order = async (req, res) => {
        try {
            const userHeader = JSON.parse(req.header("x-user"));            
            const userId = userHeader._id;
            const orderId = req.params.orderId;
            const order = await this.mongo.findById(orderId);
            if(order.userId != userId) return res.status(401).send("Unauthorized.")
            res.send(order);   
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    get_orders = async (req, res) => {
        try {
            const userHeader = req.header("x-user");
            const userId = userHeader._id;
            const orders = await this.mongo.find({userId: userId});
            res.send(orders);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
}

module.exports = OrdersService;