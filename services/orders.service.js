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
}

module.exports = OrdersService;