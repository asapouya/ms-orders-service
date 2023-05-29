class OrdersService {

    constructor({BrokerRepo}) {
        this.broker = BrokerRepo;
    }

    finalize_order = async (req, res) => {
        try {
            const userHeader = req.header("x-user");
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
                    userId: user._id,
                    books: finalized_order.bookId,
                    reason: "order-finalized",
                    timestamp: Date.now()
                }
            }), "");
            this.broker.publishMessage(exchangeName, JSON.stringify({

                eventName: "finalize.order",
                data: {
                    userId: user._id,
                    books: finalized_order.bookId,
                    reason: "order-finalized",
                    timestamp: Date.now()
                }
            }), "");
            res.send(finalized_order);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    handle_user_deletion = async () => {
        //listen for messages on rabbitmq
        const channel = await this.broker.createChannel();
        this.broker.errorEvent(err => {
            console.log(err);
        })
        await this.broker.listenForMessage("orders.user.delete.queue", async (msg) => {
            console.log(JSON.parse(msg.content.toString()));
            try {
                
                //handle message 
                
                this.broker.ack(msg);
            } catch (err) {
                console.log(err);
                this.broker.noAck(msg);
            }
        })

    }
}

module.exports = OrdersService;