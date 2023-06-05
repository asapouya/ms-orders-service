
class BrokerRepo {
        
    constructor({RabbitMQConnection}) { 
        this.connection = RabbitMQConnection
        this.channel = null;
    }
    
    createChannel = async () => {
        console.log(this.connection);
        this.channel = await this.connection.createChannel();
        console.log("2. channel created.");
    }

    createConfirmChannel = async () => {
        this.channel = await this.connection.createConfirmChannel();
        console.log("2. channel created.");
    }

    returnEvent = (callBack) => {
        this.channel.on("return", (message) => {
            callBack(message);
        })
    }

    errorEvent = (callBack) => {
        this.channel.on("error", (err) => {
            callBack(err);
        })
    }

    createExchange = async (exchangeType, exchangeName, options) => {
        await this.channel.assertExchange(exchangeName, exchangeType, options);
        console.log("3. exchange created");
    }

    createQueue = async (queueName, options) => {
        await this.channel.assertQueue(queueName, options);
        console.log("4. queue created");
    }

    bindQueueToExchange = async (queueName, exchangeName, bindingKey) => {
        await this.channel.bindQueue(queueName, exchangeName, bindingKey);
        console.log("5. queue binded to exchange");
    }

    publishMessage = (exchangeName, message, routingKey, options) => {
        return this.channel.publish(exchangeName, routingKey, Buffer.from(message), options); /**{ mandetory: true, immediate: false }**/
    }

    waitForConfirms = async () => {
        await this.channel.waitForConfirms();
    }

    close = async () => {
        await this.channel.close();
        await this.connection.close();
    }

    listenForMessage = async (queueName, callBack) => {
        console.log("listening for messages.")
        await this.channel.consume(queueName, async (msg) => {
            await callBack(msg);
        });
    }

    ack = async (msg) => {
        await this.channel.ack(msg);
        console.log("message ackowleged.")
    }

    noAck = async (msg) => {
        await this.channel.nack(msg, false, true);
        console.log("message requeued.");
    }
}
module.exports = BrokerRepo;